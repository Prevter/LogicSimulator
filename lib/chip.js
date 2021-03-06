class Chip {
    constructor() {
        this.name = "Untitled";
        this.inputPins = [];
        this.outputPins = [];
        this.color = "#2F9C46";
    }

    update() {
        this.processOutput();
        for (var i = 0; i < this.outputPins.length; i++) {
            var pin = this.outputPins[i];

            for (var j = 0; j < pin.children.length; j++) {
                var child = pin.children[j];
                if (child.chip != this && !pin.looped && !child.looped) {
                    child.chip.update();
                }
            }
        }
    }

    processOutput() {

    }

    setIndices() {
        for (var i = 0; i < this.inputPins.length; i++)
            this.inputPins[i].index = i;
        for (var i = 0; i < this.outputPins.length; i++)
            this.outputPins[i].index = i;
    }
}

class BuiltInChip extends Chip {
    constructor() {
        super();
        var inPin = new Pin(false);
        var outPin = new Pin(true);
        
        inPin.chip = this;
        outPin.chip = this;
        
        this.inputPins.push(inPin);
        this.outputPins.push(outPin);
        this.setIndices();
    }
}