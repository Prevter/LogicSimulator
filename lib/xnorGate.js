class XnorGate extends BuiltInChip  {
    constructor() {
        super();
        this.name = "XNOR";
        this.color = "#610505";
    }

    processOutput() {
        var activeCount = 0;
        var pin = this.inputPins[0];
        if (pin.parents.length > 0) {
            for (var i = 0; i < pin.parents.length; i++) {
                if (pin.parents[i].active == true) {
                    activeCount++;
                }
            }
            this.outputPins[0].active = activeCount % 2 == 0;
        }
        else {
            this.outputPins[0].active = false;
        }

    }
}