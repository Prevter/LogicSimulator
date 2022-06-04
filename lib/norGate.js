class NorGate extends Chip {
    constructor() {
        super();
        this.name = "NOR";
        var inPin = new Pin(false);
        var outPin = new Pin(true);

        inPin.chip = this;
        outPin.chip = this;

        this.inputPins.push(inPin);
        this.outputPins.push(outPin);
        this.color = "#a14d86";
        this.setIndices();
    }

    processOutput() {
        var isAllSet = true;
        var pin = this.inputPins[0];
        for (var i = 0; i < pin.parents.length; i++) {
            if (pin.parents[i].active == true) {
                isAllSet = false;
                break;
            }
        }

        this.outputPins[0].active = isAllSet;
    }
}