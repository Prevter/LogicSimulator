class NandGate extends Chip {
    constructor() {
        super();
        this.name = "NAND";
        var inPin = new Pin(false);
        var outPin = new Pin(true);

        inPin.chip = this;
        outPin.chip = this;

        this.inputPins.push(inPin);
        this.outputPins.push(outPin);
        this.color = "#25786d";
        this.setIndices();
    }

    processOutput() {
        var isAllSet = false;
        var pin = this.inputPins[0];
        for (var i = 0; i < pin.parents.length; i++) {
            if (pin.parents[i].active == false) {
                isAllSet = true;
                break;
            }
        }

        this.outputPins[0].active = isAllSet;
    }
}