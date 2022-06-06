class XorGate extends BuiltInChip {
    constructor() {
        super();
        this.name = "XOR";
        this.color = "#b57833";
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