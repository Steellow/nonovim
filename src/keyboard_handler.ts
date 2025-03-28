// Returns true if UI should be redrawn
export function handleKeyPress(e: KeyboardEvent, position: PlayerPosition, gameBoard: GameBoard, keyboardBuffer: KeyboardBuffer, constants: GameConstants): boolean {
    e.preventDefault()

    switch (e.code) {

        // Basic movement
        case "KeyH":
            return moveLeft(position, keyboardBuffer, constants)

        case "KeyJ":
            return moveDown(position, keyboardBuffer, constants)

        case "KeyK":
            return moveUp(position, keyboardBuffer, constants)

        case "KeyL":
            return moveRight(position, keyboardBuffer, constants)

        case "KeyF":
            return changeCellState(gameBoard, position, 1)

        case "KeyD":
            return changeCellState(gameBoard, position, 2)

        case "KeyS":
            return changeCellState(gameBoard, position, 0)

        default:
            // Store repeat action
            if (e.code.startsWith("Digit") && e.code !== "Digit0") {
                keyboardBuffer.repeat = Number(e.code.slice(-1))
                return false
            }
    }

    return false
}

const changeCellState = (gameBoard: GameBoard, position: PlayerPosition, state: CellState): boolean => {
    gameBoard[position.y][position.x] = state

    return true
}

const moveDown = (position: PlayerPosition, keyboardBuffer: KeyboardBuffer, constants: GameConstants) => {
    let renderUi = false
    for (let i = 0; i < keyboardBuffer.repeat; i++) {
        if (position.y + constants.colClueAreaHeight < constants.tableTotalHeight - 1) {
            position.y += 1
            renderUi = true
        }
    }

    keyboardBuffer.repeat = 1
    return renderUi
}

const moveUp = (position: PlayerPosition, keyboardBuffer: KeyboardBuffer, constants: GameConstants) => {
    let renderUi = false
    for (let i = 0; i < keyboardBuffer.repeat; i++) {
        if (position.y + constants.colClueAreaHeight > constants.colClueAreaHeight) {
            position.y -= 1
            renderUi = true
        }
    }

    keyboardBuffer.repeat = 1
    return renderUi
}

const moveLeft = (position: PlayerPosition, keyboardBuffer: KeyboardBuffer, constants: GameConstants) => {
    let renderUi = false
    for (let i = 0; i < keyboardBuffer.repeat; i++) {
        if (position.x + constants.rowClueAreaWidth > constants.rowClueAreaWidth) {
            position.x -= 1
            renderUi = true
        }
    }

    keyboardBuffer.repeat = 1
    return renderUi
}

const moveRight = (position: PlayerPosition, keyboardBuffer: KeyboardBuffer, constants: GameConstants) => {
    let renderUi = false
    for (let i = 0; i < keyboardBuffer.repeat; i++) {
        if (position.x + constants.rowClueAreaWidth < constants.tableTotalWidth - 1) {
            position.x += 1
            renderUi = true
        }
    }

    keyboardBuffer.repeat = 1
    return renderUi
}