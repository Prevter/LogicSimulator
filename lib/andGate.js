class AndGate extends Chip {
    constructor() {
        super();
        this.name = "AND";
        var inPin = new Pin(false);
        var outPin = new Pin(true);

        inPin.chip = this;
        outPin.chip = this;

        this.inputPins.push(inPin);
        this.outputPins.push(outPin);
        this.color = "#2F87B0";
        this.setIndices();
    }

    processOutput() {
        var isAllSet = true;
        var pin = this.inputPins[0];
        for (var i = 0; i < pin.parents.length; i++) {
            if (pin.parents[i].active == false) {
                isAllSet = false;
                break;
            }
        }

        this.outputPins[0].active = isAllSet;
    }
}