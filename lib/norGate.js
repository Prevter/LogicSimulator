class NorGate extends BuiltInChip {
    constructor() {
        super();
        this.name = "NOR";
        this.color = "#a14d86";
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

        this.outputPins[0].active = pin.parents.length > 0 && isAllSet;
    }
}