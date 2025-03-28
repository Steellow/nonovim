export function initializeEmptyBoard(clues: NonogramClues): GameBoard {
    const numRows = clues.rows.length;
    const numCols = clues.cols.length;
    // Initialize with '0' for empty state
    return Array.from({ length: numRows }, () => Array(numCols).fill(0));
}

/**
 * Returns the maximum length among all clue arrays in a set.
 * Example: maxClues([[1], [2, 3], [4]]) returns 2.
 */
export const getMaxClueLength = (clues: ClueSet[]): number => clues.reduce(
    (longestSoFar, currentArray) =>
        currentArray.length > longestSoFar.length ? currentArray : longestSoFar,
    clues[0]).length

export function loop(num: number): number[] {
    return Array.from({ length: num }, (_, i) => i)
}

/**
 * Determines if a cell at given table coordinates is part of the top-left blank area.
 */
export function isBlankCell(colIndex: number, rowIndex: number, constants: GameConstants): boolean {
    const blankByRow = rowIndex < constants.rowClueAreaWidth
    const blankByCol = colIndex < constants.colClueAreaHeight

    return blankByRow && blankByCol
}

/**
 * Gets the specific clue number to display at given table coordinates.
 * Returns null if the cell is blank, part of the game grid, or an empty clue slot.
 * @param rowIndex The row index in the overall table grid.
 * @param colIndex The column index in the overall table grid.
 * @param clues The nonogram clues data.
 * @returns The clue number or null.
 */
export function getClue(rowIndex: number, colIndex: number, clues: NonogramClues, constants: GameConstants): number | null {
    const { colClueAreaHeight, rowClueAreaWidth } = constants

    // 1. Check if it's in the top-left blank area
    if (isBlankCell(colIndex, rowIndex, constants)) {
        return null;
    }

    // 2. Check if it's in the main game grid area
    if (isGameBoardArea(rowIndex, colIndex, constants)) {
        return null;
    }

    // 3. Check if it's in the top (column clues) area
    if (rowIndex < colClueAreaHeight && colIndex >= rowClueAreaWidth) {
        const actualGameColIndex = colIndex - rowClueAreaWidth;
        const targetColClues = clues.cols[actualGameColIndex];

        // Calculate index within the specific column clue array
        // Clues are aligned to the bottom edge (closer to the game grid)
        const clueIndexInSet = targetColClues.length - (colClueAreaHeight - rowIndex);

        if (clueIndexInSet >= 0 && clueIndexInSet < targetColClues.length) {
            return targetColClues[clueIndexInSet];
        } else {
            return null; // Empty slot in the column clue area
        }
    }

    // 4. Check if it's in the left (row clues) area
    if (rowIndex >= colClueAreaHeight && colIndex < rowClueAreaWidth) {
        const actualGameRowIndex = rowIndex - colClueAreaHeight;
        const targetRowClues = clues.rows[actualGameRowIndex];

        // Calculate index within the specific row clue array
        // Clues are aligned to the right edge (closer to the game grid)
        const clueIndexInSet = targetRowClues.length - (rowClueAreaWidth - colIndex);

        if (clueIndexInSet >= 0 && clueIndexInSet < targetRowClues.length) {
            return targetRowClues[clueIndexInSet];
        } else {
            return null; // Empty slot in the row clue area
        }
    }

    return null;
}

export function isPlayerPosition(cellRowIndex: number, cellColIndex: number, playerPosition: PlayerPosition, constants: GameConstants): boolean {
    const playerPositionOnWholeTableX = constants.rowClueAreaWidth + playerPosition.x
    const playerPositionOnWholeTableY = constants.colClueAreaHeight + playerPosition.y

    const isFocused = cellColIndex === playerPositionOnWholeTableX && cellRowIndex === playerPositionOnWholeTableY
    if (isFocused) {
        console.debug("Focused cell - x:" + cellColIndex + ", y:" + cellRowIndex);
    }

    return isFocused
}

export function isFocusedRowOrCol(cellRowIndex: number, cellColIndex: number, playerPosition: PlayerPosition, constants: GameConstants): boolean {
    const focusOnWholeTableX = constants.rowClueAreaWidth + playerPosition.x
    const focusOnWholeTableY = constants.colClueAreaHeight + playerPosition.y

    return cellColIndex === focusOnWholeTableX || cellRowIndex === focusOnWholeTableY
}

function isGameBoardArea(rowIndex: number, colIndex: number, constants: GameConstants) {
    return rowIndex >= constants.colClueAreaHeight && colIndex >= constants.rowClueAreaWidth
}

export function isFilledCell(rowIndex: number, colIndex: number, gameBoard: GameBoard, constants: GameConstants) {
    if (!isGameBoardArea(rowIndex, colIndex, constants)) {
        return false
    }

    const gameBoardX = rowIndex - constants.colClueAreaHeight
    const gameBoardY = colIndex - constants.rowClueAreaWidth

    return gameBoard[gameBoardX][gameBoardY]
}