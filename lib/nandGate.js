class NandGate extends BuiltInChip  {
    constructor() {
        super();
        this.name = "NAND";
        this.color = "#25786d";
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