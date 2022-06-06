class OrGate extends BuiltInChip  {
    constructor() {
        super();
        this.name = "OR";
        this.color = "#9c3bd4";
    }

    processOutput() {
        var isAllSet = false;
        var pin = this.inputPins[0];
        for (var i = 0; i < pin.parents.length; i++) {
            if (pin.parents[i].active == true) {
                isAllSet = true;
                break;
            }
        }

        this.outputPins[0].active = isAllSet;
    }
}