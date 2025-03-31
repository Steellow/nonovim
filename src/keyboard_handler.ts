import { changeCellState, move } from "./gameboard_utils";

export function handleKeyPress(e: KeyboardEvent, position: PlayerPosition, gameBoard: GameBoard, keyboardBuffer: KeyboardBuffer, constants: GameConstants, clues: CluesWithState) {
    e.preventDefault()

    // <num> already pressed, then <action>
    if (keyboardBuffer.repeat > 1 && actionKeyPressed(e.code)) {
        storeAction(e.code as ActionKeyCodes, keyboardBuffer)
        console.debug(keyboardBuffer);
        return
    }

    // APPENDING

    // 1. Start appending selection (POC: only work for F)
    if (keyboardBuffer.repeat === 1 && e.code === "KeyF" && gameBoard[position.y][position.x] === 1) {
        keyboardBuffer.appending = true
        return
    }

    // 2. Choose direction
    if (keyboardBuffer.appending && moveKeyPressed(e.code)) {
        keyboardBuffer.appendingDirection = moveKeyToMoveDirection(e.code)
        console.debug(keyboardBuffer);
        return
    }

    // 3. Choose amount
    if (keyboardBuffer.appending && keyboardBuffer.appendingDirection && numberPressed(e.code)) {
        keyboardBuffer.pendingAction = 1
        keyboardBuffer.repeat = getNumber(e.code) - 1
        move(position, keyboardBuffer, constants, gameBoard, keyboardBuffer.appendingDirection, clues)

        keyboardBuffer.appending = false
        keyboardBuffer.appendingDirection = undefined
        return
    }

    switch (e.code) {

        // Basic movement (HJKL)
        case "KeyH":
            move(position, keyboardBuffer, constants, gameBoard, "left", clues)
            break

        case "KeyJ":
            move(position, keyboardBuffer, constants, gameBoard, "down", clues)
            break

        case "KeyK":
            move(position, keyboardBuffer, constants, gameBoard, "up", clues)
            break

        case "KeyL":
            move(position, keyboardBuffer, constants, gameBoard, "right", clues)
            break


        // Basic cell action (fill, cross, clear)
        case "KeyF":
            changeCellState(gameBoard, position, 1, clues, true)
            break

        case "KeyD":
            changeCellState(gameBoard, position, 2, clues, true)
            break

        case "KeyS":
            changeCellState(gameBoard, position, 0, clues, true)
            break

        default:
            // Store repeat action
            if (numberPressed(e.code)) {
                keyboardBuffer.repeat = getNumber(e.code)
                return
            }
            break
    }
}

const numberPressed = (keyCode: string) => keyCode.startsWith("Digit") && keyCode !== "Digit0"
const getNumber = (keyCode: string) => Number(keyCode.slice(-1))

const actionKeyPressed = (keyCode: string) => ["KeyS", "KeyD", "KeyF"].includes(keyCode)
const moveKeyPressed = (keyCode: string) => ["KeyH", "KeyJ", "KeyK", "KeyL"].includes(keyCode)

const moveKeyToMoveDirection = (keyCode: string): MoveDirection | undefined => {
    switch (keyCode) {
        case "KeyH":
            return "left"

        case "KeyJ":
            return "down"

        case "KeyK":
            return "up"

        case "KeyL":
            return "right"
    }

    // TODO: error handling, shouldn't reach here!
    return undefined
}

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