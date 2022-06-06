var currentChipHasLoop = false;

function markAllLoops(chips) {
    var chipsWithLoops = [];
    var examinedChips = [];
    // Clear all loop marks
    for (var i = 0; i < chips.length; i++) {
        for (var j = 0; j < chips[i].inputPins.length; j++) {
            chips[i].inputPins[j].looped = false;
        }
    }

    // Mark loops
    for (var i = 0; i < chips.length; i++) {
        examinedChips = [];
        currentChipHasLoop = false;
        markLoops(chips[i], chips[i], examinedChips);
        if (currentChipHasLoop)
            chipsWithLoops.push(chips[i]);
    }
    return chipsWithLoops;
}

/**
 * @param {Chip} original 
 * @param {Chip} current
 * @param {Array} examinedChips
 */
function markLoops(original, current, examined) {
    if (!examined.includes(current)){
        examined.push(current);
    } else {
        return;
    }

    for (var i = 0; i < current.outputPins.length; i++) {
        var outputPin = current.outputPins[i];
        for (var j = 0; j < outputPin.children.length; j++) {
            var childPin = outputPin.children[j];
            var childChip = childPin.chip;
            if (childChip) {
                if (childChip == original) {
                    current.inputPins[i].looped = true;
                    currentChipHasLoop = true;
                } else if (!childPin.looped) {
                    markLoops(original, childChip, examined);
                }
            }
        }
    }
}