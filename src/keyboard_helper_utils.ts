import m from 'mithril';


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

export const getHelpDialog = (buffer: KeyboardBuffer) => {
    return m("div.help", [
        movementText(buffer),
        actionText(buffer),
        m("p.sub", "F = fill cell"),
        m("p.sub", "D = cross cell"),
        m("p.sub", "S = clear cell"),
        m("p.divider", "<num> to repeat action"),
        m("p.sub", "3J = move down 3"),
        m("p.sub", "3FJ = move down 3 & fill cells"),
    ])
}

const movementText = (buffer: KeyboardBuffer) => {
    const boldText = buffer.repeat > 1
    return m("p", { class: boldText ? "bold" : "" }, "[HJKL] to move")
}

const actionText = (buffer: KeyboardBuffer) => {
    const boldText = buffer.repeat > 1 && buffer.pendingAction === null
    return m("p.divider", { class: boldText ? "bold" : "" }, "[FDS] to change cell")
}