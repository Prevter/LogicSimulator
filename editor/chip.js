const PIN_RADIUS = 18;
const PIN_DISTANCE = 20;

function ChipRenderer(chip) {
    this.pos = createVector(width / 2, height / 2);
    this.size = createVector(100, 50);
    this.chip = chip;
    this.overPin = null;
    chip.renderer = this;

    this.calculateSize = function () {
        var length = textWidth(this.chip.name);
        this.size.x = length + 42;

        var inHeight = 0;
        var outHeight = 0;
        for (var i = 0; i < this.chip.inputPins.length; i++) {
            var pin = this.chip.inputPins[i];
            inHeight += 20;
        }
        for (var i = 0; i < this.chip.outputPins.length; i++) {
            var pin = this.chip.outputPins[i];
            outHeight += 20;
        }
        this.size.y = max(inHeight, outHeight, textAscent()) + 16;
    }

    this.calculateSize();
    this.pos.sub(this.size.copy().div(2));

    this.isOverChip = function () {
        if (this.getOverPin()) return false;

        return mouseX > this.pos.x && mouseX < this.pos.x + this.size.x &&
            mouseY > this.pos.y && mouseY < this.pos.y + this.size.y;
    }

    this.getOverPin = function () {
        for (var i = 0; i < this.chip.inputPins.length; i++) {
            var pos = this.getPinPos(i, false);
            if (dist(mouseX, mouseY, pos.x, pos.y) < PIN_RADIUS + 2) {
                return this.chip.inputPins[i];
            }
        }

        for (var i = 0; i < this.chip.outputPins.length; i++) {
            var pos = this.getPinPos(i, true);
            if (dist(mouseX, mouseY, pos.x, pos.y) < PIN_RADIUS + 2) {
                return this.chip.outputPins[i];
            }
        }

        return null;
    }

    this.getPinPos = function (index, isOutput) {
        var pinX = isOutput ? this.pos.x + this.size.x : this.pos.x;

        var count = isOutput ? this.chip.outputPins.length : this.chip.inputPins.length;
        var blockSize = this.size.y / count;

        var pinY = this.pos.y + (index * blockSize + blockSize / 2);
        return createVector(pinX, pinY);
    }

    this.show = function () {
        noStroke();
        fill(this.chip.color);
        rect(this.pos.x, this.pos.y, this.size.x, this.size.y, 8);

        stroke(0);
        fill(255);
        text(this.chip.name, this.pos.x + this.size.x / 2, this.pos.y + this.size.y / 2);

        fill(0);
        for (var i = 0; i < this.chip.inputPins.length; i++) {
            var pin = this.chip.inputPins[i];
            var pos = this.getPinPos(i, false);
            circle(pos.x, pos.y, PIN_RADIUS);
        }
        for (var i = 0; i < this.chip.outputPins.length; i++) {
            var pin = this.chip.outputPins[i];
            var pos = this.getPinPos(i, true);
            circle(pos.x, pos.y, PIN_RADIUS);
        }
    }
}