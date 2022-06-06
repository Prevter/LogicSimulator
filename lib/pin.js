class Pin {
    constructor(isOutput) {
        this.type = isOutput ? "output" : "input";
        this.chip = null;
        this.index = 0;
        this.name = "";
        this.parents = [];
        this.children = [];
        this.active = false;
        this.looped = false;
    }
}

/**
 * Connects the pins together.
 * @param {Pin} pinA 
 * @param {Pin} pinB 
 */
function makeConnection(pinA, pinB) {
    if (isValidConnection(pinA, pinB)) {
        var parentPin = (pinA.type == "output") ? pinA : pinB;
        var childPin = (pinA.type == "input") ? pinA : pinB;

        parentPin.children.push(childPin);
        childPin.parents.push(parentPin);
    }
}

/**
 * Disconnects the pins from one another.
 * @param {Pin} pinA First pin
 * @param {Pin} pinB Second pin
 */
function removeConnection(pinA, pinB) {
    var parentPin = (pinA.type == "output") ? pinA : pinB;
    var childPin = (pinA.type == "input") ? pinA : pinB;

    parentPin.children.remove(childPin);
    childPin.parents.remove(parentPin);
}

/**
 * Checks if pin connection is valid.
 * @param {Pin} pinA First pin
 * @param {Pin} pinB Second pin
 */
function isValidConnection(pinA, pinB) {
    return pinA.type != pinB.type;
}

Array.prototype.remove = function () {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};