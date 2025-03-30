import { checkCluesForRowAndColumn } from "./clue_utils";
import { changeCellState, move } from "./gameboard_utils";

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