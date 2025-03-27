// Returns true if UI should be redrawn
export function handleKeyPress(e: KeyboardEvent, state: GameState): boolean {
    e.preventDefault()

    switch (e.code) {

        // Basic movement
        case "KeyH":
            return moveLeft(state)

        case "KeyJ":
            return moveDown(state)

        case "KeyK":
            return moveUp(state)

        case "KeyL":
            return moveRight(state)

        default:
            // Store repeat action
            if (e.code.startsWith("Digit") && e.code !== "Digit0") {
                state.keyboardBuffer.repeat = Number(e.code.slice(-1))
                return false
            }
    }

    return false
}

const moveDown = (state: GameState) => {
    let renderUi = false
    for (let i = 0; i < state.keyboardBuffer.repeat; i++) {
        if (state.y + state.constants.colClueAreaHeight < state.constants.tableTotalHeight - 1) {
            state.y += 1
            renderUi = true
        }
    }

    state.keyboardBuffer.repeat = 1
    return renderUi
}

const moveUp = (state: GameState) => {
    let renderUi = false
    for (let i = 0; i < state.keyboardBuffer.repeat; i++) {
        if (state.y + state.constants.colClueAreaHeight > state.constants.colClueAreaHeight) {
            state.y -= 1
            renderUi = true
        }
    }

    state.keyboardBuffer.repeat = 1
    return renderUi
}

const moveLeft = (state: GameState) => {
    let renderUi = false
    for (let i = 0; i < state.keyboardBuffer.repeat; i++) {
        if (state.x + state.constants.rowClueAreaWidth > state.constants.rowClueAreaWidth) {
            state.x -= 1
            renderUi = true
        }
    }

    state.keyboardBuffer.repeat = 1
    return renderUi
}

const moveRight = (state: GameState) => {
    let renderUi = false
    for (let i = 0; i < state.keyboardBuffer.repeat; i++) {
        if (state.x + state.constants.rowClueAreaWidth < state.constants.tableTotalWidth - 1) {
            state.x += 1
            renderUi = true
        }
    }

    state.keyboardBuffer.repeat = 1
    return renderUi
}