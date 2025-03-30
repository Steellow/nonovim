import { checkCluesForRowAndColumn } from "./clue_utils";
import { changeCellState, move } from "./gameboard_utils";

export function handleKeyPress(e: KeyboardEvent, position: PlayerPosition, gameBoard: GameBoard, keyboardBuffer: KeyboardBuffer, constants: GameConstants, clues: CluesWithState) {
    e.preventDefault()

    // <num> already pressed, then <action>
    if (keyboardBuffer.repeat > 1 && actionKeyPressed(e.code)) {
        storeAction(e.code as ActionKeyCodes, keyboardBuffer)
        console.debug(keyboardBuffer);
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
            if (e.code.startsWith("Digit") && e.code !== "Digit0") {
                keyboardBuffer.repeat = Number(e.code.slice(-1))
                return
            }
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