class AndGate extends BuiltInChip  {
    constructor() {
        super();
        this.name = "AND";
        this.color = "#2F87B0";
    }

    processOutput() {
        var pin = this.inputPins[0];
        var isAllSet = pin.parents.length > 0;
        for (var i = 0; i < pin.parents.length; i++) {
            if (pin.parents[i].active == false) {
                isAllSet = false;
                break;
            }
        }

        this.outputPins[0].active = isAllSet;
    }
}