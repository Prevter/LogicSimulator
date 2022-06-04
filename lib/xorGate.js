class XorGate extends Chip {
    constructor() {
        super();
        this.name = "XOR";
        var inPin = new Pin(false);
        var outPin = new Pin(true);

        inPin.chip = this;
        outPin.chip = this;

        this.inputPins.push(inPin);
        this.outputPins.push(outPin);
        this.color = "#b57833";
        this.setIndices();
    }

    processOutput() {
        var activeCount = 0;
        var pin = this.inputPins[0];
        for (var i = 0; i < pin.parents.length; i++) {
            if (pin.parents[i].active == true) {
                activeCount++;
            }
        }

        this.outputPins[0].active = activeCount % 2 == 1;
    }
}