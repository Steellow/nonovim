import { checkCluesForRowAndColumn } from "./clue_utils"

/**
 * @param gameBoard Full gameboard state
 * @param xPosition Player position on the X axis
 * @returns Array of cell state values in a column in xPosition
 */
export const getGameboardColumnStatesAsArray = (gameBoard: CellState[][], xPosition: number): CellState[] => {
    return gameBoard.map(row =>
        row[xPosition]
    )
}

/**
 * Changes cell state (0=empty, 1=filled, 2=crossed) at a given position
 * If clues are provided and shouldCheckClues = true, also checks if any clues should be crossed
 */
export const changeCellState = (gameBoard: GameBoard, position: PlayerPosition, state: CellState, clues?: CluesWithState, shouldCheckClues: boolean = false): boolean => {
    gameBoard[position.y][position.x] = state

    if (shouldCheckClues && clues !== undefined) {
        checkCluesForRowAndColumn(clues, gameBoard, position)
    }

    return true
}

/**
 * Moves player to given direction x times (times from keyboardBuffer)
 * Also checks clue states
 */
export const move = (position: PlayerPosition, keyboardBuffer: KeyboardBuffer, constants: GameConstants, gameBoard: GameBoard, direction: MoveDirection, clues: CluesWithState) => {
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
            moveToDirection(direction, position)

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

const moveToDirection = (direction: MoveDirection, position: PlayerPosition) => {
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

/**
 * Returns a string of relevant CSS classes for a cell on the game board
 */
export function getCellClasses(
    gameBoard: GameBoard,
    position: PlayerPosition,
    rowIndex: number,
    colIndex: number,
): string {

    const classes = []

    if (isPlayerPosition(rowIndex, colIndex, position)) {
        classes.push("player-position")
    }

    if (isFocusedRowOrCol(rowIndex, colIndex, position)) {
        classes.push("focused")
    }

    const cellState = getCellState(rowIndex, colIndex, gameBoard)
    if (cellState === 1) {
        classes.push("filled")
    } else if (cellState === 2) {
        classes.push("crossed")
    }


    return classes.join(" ")
}

export function initializeEmptyBoard(clues: Clues): GameBoard {
    const numRows = clues.left.length;
    const numCols = clues.top.length;
    // Initialize with '0' for empty state
    return Array.from({ length: numRows }, () => Array(numCols).fill(0));
}

export const isPlayerPosition = (cellRowIndex: number, cellColIndex: number, playerPosition: PlayerPosition) => cellColIndex === playerPosition.x && cellRowIndex === playerPosition.y

export const isFocusedRowOrCol = (cellRowIndex: number, cellColIndex: number, playerPosition: PlayerPosition) => cellColIndex === playerPosition.x || cellRowIndex === playerPosition.y

export const getCellState = (rowIndex: number, colIndex: number, gameBoard: GameBoard): CellState => {
    return gameBoard[rowIndex][colIndex]
}