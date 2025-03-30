// this file contains help texts and stuff for shortcuts
// does not actually handle any keyboard presses
export const getKeyboardBufferText = (buffer: KeyboardBuffer): string => {
    let text = ""

    if (buffer.repeat > 1) {
        text += buffer.repeat
    }

    if (buffer.pendingAction) {
        text += getPendingActionLetter(buffer.pendingAction)
    }

    return text
}

const getPendingActionLetter = (pendingAction: CellState) => {
    switch (pendingAction) {
        case 0: return "S"
        case 1: return "F"
        case 2: return "D"
    }
}