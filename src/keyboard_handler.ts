// Returns true if UI should be redrawn
export function handleKeyPress(e: KeyboardEvent, state: GameState): boolean {
    e.preventDefault()

    switch (e.code) {

        // Basic movement
        case "KeyH":
            return moveLeft(state, 1)

        case "KeyJ":
            return moveDown(state, 1)

        case "KeyK":
            return moveUp(state, 1)

        case "KeyL":
            return moveRight(state, 1)
    }

    return false
}

const moveDown = (state: GameState, repeat: number) => {
    let renderUi = false
    for (let i = 0; i < repeat; i++) {
        if (state.y + state.constants.colClueAreaHeight < state.constants.tableTotalHeight - 1) {
            state.y += 1
            renderUi = true
        }
    }
    return renderUi
}

const moveUp = (state: GameState, repeat: number) => {
    let renderUi = false
    for (let i = 0; i < repeat; i++) {
        if (state.y + state.constants.colClueAreaHeight > state.constants.colClueAreaHeight) {
            state.y -= 1
            renderUi = true
        }
    }
    return renderUi
}

const moveLeft = (state: GameState, repeat: number) => {
    let renderUi = false
    for (let i = 0; i < repeat; i++) {
        if (state.x + state.constants.rowClueAreaWidth > state.constants.rowClueAreaWidth) {
            state.x -= 1
            renderUi = true
        }
    }
    return renderUi
}

const moveRight = (state: GameState, repeat: number) => {
    let renderUi = false
    for (let i = 0; i < repeat; i++) {
        if (state.x + state.constants.rowClueAreaWidth < state.constants.tableTotalWidth - 1) {
            state.x += 1
            renderUi = true
        }
    }
    return renderUi
}