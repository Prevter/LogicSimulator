let chips = [];
let draggedChip = null;
let firstPin = null;
let isFirstPinGlobal = false;

let editedChip = null;

let toRemove = -1;

const WIRE_COLOR = "#20252E";
const WIRE_ENABLED_COLOR = "#EC2239";

function renameCurrentChip(name) {
    editedChip.name = name;
}

function setup() {
    var canvas = createCanvas(windowWidth, windowHeight);
    editedChip = new Chip();

    frameRate(144);
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(14);

    // TODO: make adding new pins in UI
    editedChip.inputPins.push(new Pin(true));
    editedChip.inputPins[0].name = "A";
    editedChip.inputPins[0].chip = editedChip;
    editedChip.inputPins.push(new Pin(true));
    editedChip.inputPins[1].name = "B";
    editedChip.inputPins[1].chip = editedChip;
    editedChip.inputPins.push(new Pin(true));
    editedChip.inputPins[2].name = "Carry";
    editedChip.inputPins[2].chip = editedChip;

    editedChip.outputPins.push(new Pin(false));
    editedChip.outputPins[0].name = "Out";
    editedChip.outputPins[0].chip = editedChip;
    editedChip.outputPins.push(new Pin(false));
    editedChip.outputPins[1].name = "Carry";
    editedChip.outputPins[1].chip = editedChip;

    editedChip.setIndices();
}

function getEditedChipPinPos(index, output) {
    var x = output ? 30 : width - 30;
    var y = 0;

    if (output) {
        var inputsHeight = editedChip.inputPins.length * 64;
        y = height / 2 - inputsHeight / 2 + index * 64 + 45;
    }
    else {
        var outputsHeight = editedChip.outputPins.length * 64;
        y = height / 2 - outputsHeight / 2 + index * 64 + 45;
    }

    return createVector(x, y);
}

function moveToEnd(index) {
    chips.push(chips.splice(index, 1)[0]);
}

function draw() {
    background(54);
    stroke("#464646");
    fill(50);
    rect(30, 70, width - 60, height - 130);

    var onlyChips = [];
    for (var i = 0; i < chips.length; i++) {
        onlyChips.push(chips[i].chip);
    }
    markAllLoops(onlyChips);

    for (var i = 0; i < chips.length; i++) {
        chips[i].show();
        onlyChips[i].update();
    }

    if (toRemove != -1) {
        chips.splice(toRemove, 1);
        toRemove = -1;
    }

    for (var i = chips.length - 1; i >= 0; i--) {
        var overPin = chips[i].getOverPin();
        var overChip = chips[i].isOverChip();

        if (overChip && toRemove == -1) {
            // If delete key pressed, delete chip
            if (keyIsDown(8) || keyIsDown(46)) {
                // Remove all wires connected to this chip
                for (var j = 0; j < chips[i].chip.inputPins.length; j++) {
                    var pin = chips[i].chip.inputPins[j];

                    for (var k = 0; k < pin.children.length; k++) {
                        var child = pin.children[k];
                        child.parents.remove(pin);
                    }
                    pin.children = [];
                    for (var k = 0; k < pin.parents.length; k++) {
                        var parent = pin.parents[k];
                        parent.children.remove(pin);
                    }
                    pin.parents = [];
                }

                for (var j = 0; j < chips[i].chip.outputPins.length; j++) {
                    var pin = chips[i].chip.outputPins[j];

                    for (var k = 0; k < pin.children.length; k++) {
                        var child = pin.children[k];
                        child.parents.remove(pin);
                    }
                    pin.children = [];
                    for (var k = 0; k < pin.parents.length; k++) {
                        var parent = pin.parents[k];
                        parent.children.remove(pin);
                    }
                    pin.parents = [];
                }

                toRemove = i;
            }
        }


        // If the mouse is over a chip, drag it
        if (!draggedChip && !overPin && !firstPin && overChip) {
            if (mouseIsPressed) {
                draggedChip = chips[i];
            }
        } // If the mouse is over a pin, start wiring 
        else if (overPin && !firstPin && !draggedChip) {
            if (mouseIsPressed) {
                draggedChip = chips[i];
                firstPin = overPin;
            }
        } // If the mouse stopped over another pin, connect them
        else if (overPin && firstPin) {
            if (!mouseIsPressed) {
                if (firstPin.chip != chips[i].chip &&
                    firstPin.parents.indexOf(overPin) == -1 &&
                    overPin.parents.indexOf(firstPin) == -1) {
                    makeConnection(firstPin, overPin);
                } else {
                    removeConnection(firstPin, overPin);
                }
            }
        }

        // Connect all children lines
        for (var j = 0; j < chips[i].chip.outputPins.length; j++) {
            var pin = chips[i].chip.outputPins[j];
            var pos = chips[i].getPinPos(j, true);
            for (var k = 0; k < pin.children.length; k++) {
                var child = pin.children[k];
                var childPos;
                if (child.chip == editedChip)
                    childPos = getEditedChipPinPos(child.index, false);
                else
                    var childPos = child.chip.renderer.getPinPos(child.index, false);

                push();
                if (pin.active) stroke(WIRE_ENABLED_COLOR);
                else stroke(WIRE_COLOR);

                strokeWeight(4);
                line(childPos.x, childPos.y, pos.x, pos.y);
                pop();
            }
        }

    }

    // If the mouse is dragging a chip, move it
    if (!firstPin && draggedChip && mouseIsPressed) {
        cursor('grab');
        draggedChip.pos.x = mouseX - draggedChip.size.x / 2;
        draggedChip.pos.y = mouseY - draggedChip.size.y / 2;
    }
    // If the mouse is dragging a pin, show a wire
    else if (firstPin && mouseIsPressed) {
        var pos;
        if (isFirstPinGlobal)
            pos = getEditedChipPinPos(firstPin.index, firstPin.type == "output");
        else
            pos = draggedChip.getPinPos(firstPin.index, firstPin.type == "output");

        strokeWeight(4);
        stroke(WIRE_COLOR);
        line(mouseX, mouseY, pos.x, pos.y);
        strokeWeight(1);
    }

    // Draw edited chip lines
    for (var i = 0; i < editedChip.inputPins.length; i++) {
        var pin = editedChip.inputPins[i];
        var pos = getEditedChipPinPos(i, true);
        for (var j = 0; j < pin.children.length; j++) {
            var child = pin.children[j];
            var childPos;
            if (child.chip == editedChip)
                childPos = getEditedChipPinPos(child.index, false);
            else
                var childPos = child.chip.renderer.getPinPos(child.index, false);

            push();
            if (pin.active) stroke(WIRE_ENABLED_COLOR);
            else stroke(WIRE_COLOR);

            strokeWeight(4);
            line(childPos.x, childPos.y, pos.x, pos.y);
            pop();
        }
    }

    noStroke();
    // Left side of pins
    for (var i = 0; i < editedChip.inputPins.length; i++) {
        var pin = editedChip.inputPins[i];
        var pos = getEditedChipPinPos(i, true);
        if (pin.active) fill(255, 0, 0);
        else fill(0);
        circle(pos.x, pos.y, 30);

        fill(255);
        text(pin.name, pos.x, pos.y - 30);

        if (dist(mouseX, mouseY, pos.x, pos.y) < 30) {
            if (!firstPin && mouseIsPressed) {
                firstPin = pin;
                isFirstPinGlobal = true;
            }
            else if (firstPin && !mouseIsPressed) {
                if (firstPin == pin) {
                    pin.active = !pin.active;
                } else if (firstPin.parents.indexOf(pin) == -1)
                    makeConnection(firstPin, pin);
                else {
                    removeConnection(firstPin, pin);
                }
            }
        }
    }

    // Right side of pins
    for (var i = 0; i < editedChip.outputPins.length; i++) {
        var pin = editedChip.outputPins[i];
        var pos = getEditedChipPinPos(i, false);
        fill(0);
        for (var j = 0; j < pin.parents.length; j++) {
            if (pin.parents[j].active) {
                fill(255, 0, 0);
                break;
            }
        }
        circle(pos.x, pos.y, 30);
        fill(255);
        text(pin.name, pos.x, pos.y - 30);

        if (dist(mouseX, mouseY, pos.x, pos.y) < 30) {
            if (!firstPin && mouseIsPressed) {
                firstPin = pin;
                isFirstPinGlobal = true;
            }
            else if (firstPin && !mouseIsPressed) {
                if (pin.parents.indexOf(firstPin) == -1)
                    makeConnection(firstPin, pin);
                else {
                    removeConnection(firstPin, pin);
                }
            }
        }
    }

    // Reset variables if mouse not pressed
    if (!mouseIsPressed) {
        cursor('default');
        draggedChip = null;
        firstPin = null;
        isFirstPinGlobal = false;
    }

    stroke(255, 0, 0);
    fill(255);
    text(Math.round(frameRate()) + " fps", width / 2, height - 70);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}