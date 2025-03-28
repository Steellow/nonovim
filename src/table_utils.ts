export function initializeEmptyBoard(clues: NonogramClues): GameBoard {
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

// Returns the clue which should be shown in cell,
// if no clue in that cell, returns null
export const getTopClue = (
    clues: ClueSet[],
    nthClueFromLeft: number,
    nthClueFromTop: number): number | null => {
    const cluesForThisColumn = clues[nthClueFromLeft]

    if (nthClueFromTop >= cluesForThisColumn.length) {
        return null
    }

    return cluesForThisColumn[nthClueFromTop]
}

// Returns the clue which should be shown in cell,
// if no clue in that cell, returns null
export const getLeftClue = (
    clues: ClueSet[],
    nthClueFromLeft: number,
    nthClueFromTop: number,
    rowClueAreaWidth: number
): number | null => {
    const cluesForThisRow = clues[nthClueFromTop]

    // Calculate the left offset so that clues are right-aligned
    const offset = rowClueAreaWidth - cluesForThisRow.length

    if (nthClueFromLeft < offset) {
        return null
    }

    return cluesForThisRow[nthClueFromLeft - offset]
}
