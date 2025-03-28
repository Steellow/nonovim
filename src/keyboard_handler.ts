// Returns true if UI should be redrawn
export function handleKeyPress(e: KeyboardEvent, position: PlayerPosition, keyboardBuffer: KeyboardBuffer, constants: GameConstants): boolean {
    e.preventDefault()

    switch (e.code) {

        // Basic movement
        case "KeyH":
            return moveLeft(position, keyboardBuffer.repeat, constants)

        case "KeyJ":
            return moveDown(position, keyboardBuffer.repeat, constants)

        case "KeyK":
            return moveUp(position, keyboardBuffer.repeat, constants)

        case "KeyL":
            return moveRight(position, keyboardBuffer.repeat, constants)

        default:
            // Store repeat action
            if (e.code.startsWith("Digit") && e.code !== "Digit0") {
                keyboardBuffer.repeat = Number(e.code.slice(-1))
                return false
            }
    }

    return false
}

const moveDown = (position: PlayerPosition, repeat: number, constants: GameConstants) => {
    let renderUi = false
    for (let i = 0; i < repeat; i++) {
        if (position.y + constants.colClueAreaHeight < constants.tableTotalHeight - 1) {
            position.y += 1
            renderUi = true
        }
    }

    repeat = 1
    return renderUi
}

const moveUp = (position: PlayerPosition, repeat: number, constants: GameConstants) => {
    let renderUi = false
    for (let i = 0; i < repeat; i++) {
        if (position.y + constants.colClueAreaHeight > constants.colClueAreaHeight) {
            position.y -= 1
            renderUi = true
        }
    }

    repeat = 1
    return renderUi
}

const moveLeft = (position: PlayerPosition, repeat: number, constants: GameConstants) => {
    let renderUi = false
    for (let i = 0; i < repeat; i++) {
        if (position.x + constants.rowClueAreaWidth > constants.rowClueAreaWidth) {
            position.x -= 1
            renderUi = true
        }
    }

    repeat = 1
    return renderUi
}

const moveRight = (position: PlayerPosition, repeat: number, constants: GameConstants) => {
    let renderUi = false
    for (let i = 0; i < repeat; i++) {
        if (position.x + constants.rowClueAreaWidth < constants.tableTotalWidth - 1) {
            position.x += 1
            renderUi = true
        }
    }

    repeat = 1
    return renderUi
}