export function initializeEmptyBoard(clues: Clues): GameBoard {
    const numRows = clues.left.length;
    const numCols = clues.top.length;
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

export const isPlayerPosition = (cellRowIndex: number, cellColIndex: number, playerPosition: PlayerPosition) => cellColIndex === playerPosition.x && cellRowIndex === playerPosition.y

export const isFocusedRowOrCol = (cellRowIndex: number, cellColIndex: number, playerPosition: PlayerPosition) => cellColIndex === playerPosition.x || cellRowIndex === playerPosition.y

export const getCellState = (rowIndex: number, colIndex: number, gameBoard: GameBoard): CellState => {
    return gameBoard[rowIndex][colIndex]
}

export const getTopClue = (
    clues: ClueSetWithState[],
    nthClueFromLeft: number,
    nthClueFromTop: number,
    topClueAreaHeight: number
): ClueWithState | null => {
    const cluesForThisColumn = clues[nthClueFromLeft]
    const offset = topClueAreaHeight - cluesForThisColumn.length

    if (nthClueFromTop < offset) {
        return null
    }

    return cluesForThisColumn[nthClueFromTop - offset]
}


// Returns the clue which should be shown in cell,
// if no clue in that cell, returns null
export const getLeftClue = (
    clues: ClueSetWithState[],
    nthClueFromLeft: number,
    nthClueFromTop: number,
    rowClueAreaWidth: number
): ClueWithState | null => {
    const cluesForThisRow = clues[nthClueFromTop]
    const offset = rowClueAreaWidth - cluesForThisRow.length

    if (nthClueFromLeft < offset) {
        return null
    }

    return cluesForThisRow[nthClueFromLeft - offset]
}

export const getRelativeLineNumber = (index: number, playerPosition: number): number => Math.abs(playerPosition - index)