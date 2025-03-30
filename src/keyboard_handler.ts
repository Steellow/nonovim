import { checkCluesForRowAndColumn } from "./clue_util";

// Returns true if UI should be redrawn
export function handleKeyPress(e: KeyboardEvent, position: PlayerPosition, gameBoard: GameBoard, keyboardBuffer: KeyboardBuffer, constants: GameConstants, clues: CluesWithState): boolean {
    e.preventDefault()

    // <num> already pressed, then <action>
    if (keyboardBuffer.repeat > 1 && actionKeyPressed(e.code)) {
        storeAction(e.code as ActionKeyCodes, keyboardBuffer)
        console.debug(keyboardBuffer);
        return false
    }

    switch (e.code) {

        // Basic movement (HJKL)
        case "KeyH":
            return move(position, keyboardBuffer, constants, gameBoard, "left", clues)

        case "KeyJ":
            return move(position, keyboardBuffer, constants, gameBoard, "down", clues)

        case "KeyK":
            return move(position, keyboardBuffer, constants, gameBoard, "up", clues)

        case "KeyL":
            return move(position, keyboardBuffer, constants, gameBoard, "right", clues)


        // Basic cell action (fill, cross, clear)
        case "KeyF":
            return changeCellState(gameBoard, position, 1, clues, true)

        case "KeyD":
            return changeCellState(gameBoard, position, 2, clues, true)

        case "KeyS":
            return changeCellState(gameBoard, position, 0, clues, true)

        default:
            // Store repeat action
            if (e.code.startsWith("Digit") && e.code !== "Digit0") {
                keyboardBuffer.repeat = Number(e.code.slice(-1))
                return false
            }
    }

    return false
}

const changeCellState = (gameBoard: GameBoard, position: PlayerPosition, state: CellState, clues?: CluesWithState, shouldCheckClues: boolean = false): boolean => {
    gameBoard[position.y][position.x] = state

    if (shouldCheckClues && clues !== undefined) {
        checkCluesForRowAndColumn(clues, gameBoard, position)
    }

    return true
}

const move = (position: PlayerPosition, keyboardBuffer: KeyboardBuffer, constants: GameConstants, gameBoard: GameBoard, direction: MoveDirection, clues: CluesWithState) => {
    let renderUi = false

    const boundaryCheck = getMovementBoundaryCheck(direction, position, constants)

    // Save pending action and remove it from state
    const pendingAction = keyboardBuffer.pendingAction
    keyboardBuffer.pendingAction = null

    // When painting multiple cells at a time,
    // also paint the starting position
    if (pendingAction !== null) {
        // check clues: false
        changeCellState(gameBoard, position, pendingAction)
    }

    // Repeat movement x times
    for (let i = 0; i < keyboardBuffer.repeat; i++) {
        if (boundaryCheck()) {
            simpleMove(direction, position)

            // If pending action in keyboard buffer
            if (pendingAction !== null) {
                changeCellState(
                    gameBoard,
                    position,
                    pendingAction,
                    clues,
                    i === keyboardBuffer.repeat - 1
                )
            }

            renderUi = true
        } else {
            break
        }
    }

    keyboardBuffer.repeat = 1
    return renderUi
}

const getMovementBoundaryCheck = (direction: MoveDirection, position: PlayerPosition, constants: GameConstants): () => boolean => {
    switch (direction) {
        case "left":
            return () => position.x > 0

        case "right":
            return () => position.x < constants.gameWidth - 1

        case "up":
            return () => position.y > 0

        case "down":
            return () => position.y < constants.gameHeight - 1
    }
}

const simpleMove = (direction: MoveDirection, position: PlayerPosition) => {
    switch (direction) {
        case "left":
            position.x--
            break;

        case "right":
            position.x++
            break

        case "up":
            position.y--
            break

        case "down":
            position.y++
            break
    }
}

const actionKeyPressed = (keyCode: string) => ["KeyS", "KeyD", "KeyF"].includes(keyCode)

const storeAction = (keyCode: ActionKeyCodes, keyboardBuffer: KeyboardBuffer) => {
    switch (keyCode) {
        case "KeyS":
            keyboardBuffer.pendingAction = 0
            break;

        case "KeyD":
            keyboardBuffer.pendingAction = 2
            break;

        case "KeyF":
            keyboardBuffer.pendingAction = 1
            break;

        default:
            console.error("Cannot store action " + keyCode);
            break;
    }
} 