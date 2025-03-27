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

export function getTableTotalWidth(clues: NonogramClues): number {
    const gameWidth: number = clues.cols.length
    const maxRowClues: number = getMaxClueLength(clues.rows)

    return gameWidth + maxRowClues
}

export function getTableTotalHeight(clues: NonogramClues): number {
    const gameHeight: number = clues.rows.length
    const maxColClues: number = getMaxClueLength(clues.cols)

    return gameHeight + maxColClues
}

export function loop(num: number): number[] {
    return Array.from({ length: num }, (_, i) => i)
}

/**
 * Determines if a cell at given table coordinates is part of the top-left blank area.
 */
export function isBlankCell(colIndex: number, rowIndex: number, clues: NonogramClues): boolean {
    const blankByRow = rowIndex < getMaxClueLength(clues.rows)
    const blankByCol = colIndex < getMaxClueLength(clues.cols)

    return blankByRow && blankByCol
}

/**
 * Gets the specific clue number to display at given table coordinates.
 * Returns null if the cell is blank, part of the game grid, or an empty clue slot.
 * @param tableRowIndex The row index in the overall table grid.
 * @param tableColIndex The column index in the overall table grid.
 * @param clues The nonogram clues data.
 * @returns The clue number or null.
 */
export function getClue(tableRowIndex: number, tableColIndex: number, clues: NonogramClues): number | null {
    const maxRowClues = getMaxClueLength(clues.rows);  // Width of the row clue area
    const maxColClues = getMaxClueLength(clues.cols);  // Height of the col clue area

    // 1. Check if it's in the top-left blank area
    if (tableRowIndex < maxColClues && tableColIndex < maxRowClues) {
        return null;
    }

    // 2. Check if it's in the main game grid area
    if (tableRowIndex >= maxColClues && tableColIndex >= maxRowClues) {
        return null;
    }

    // 3. Check if it's in the top (column clues) area
    if (tableRowIndex < maxColClues && tableColIndex >= maxRowClues) {
        const actualGameColIndex = tableColIndex - maxRowClues;
        const targetColClues = clues.cols[actualGameColIndex];

        // Calculate index within the specific column clue array
        // Clues are aligned to the bottom edge (closer to the game grid)
        const clueIndexInSet = targetColClues.length - (maxColClues - tableRowIndex);

        if (clueIndexInSet >= 0 && clueIndexInSet < targetColClues.length) {
            return targetColClues[clueIndexInSet];
        } else {
            return null; // Empty slot in the column clue area
        }
    }

    // 4. Check if it's in the left (row clues) area
    if (tableRowIndex >= maxColClues && tableColIndex < maxRowClues) {
        const actualGameRowIndex = tableRowIndex - maxColClues;
        const targetRowClues = clues.rows[actualGameRowIndex];

        // Calculate index within the specific row clue array
        // Clues are aligned to the right edge (closer to the game grid)
        const clueIndexInSet = targetRowClues.length - (maxRowClues - tableColIndex);

        if (clueIndexInSet >= 0 && clueIndexInSet < targetRowClues.length) {
            return targetRowClues[clueIndexInSet];
        } else {
            return null; // Empty slot in the row clue area
        }
    }

    return null;
}

export function isFocusedCell(cellRowIndex: number, cellColIndex: number, focusX: number, focusY: number, clues: NonogramClues): boolean {
    const rowClueAreaWidth = getMaxClueLength(clues.rows);
    const colClueAreaHeight = getMaxClueLength(clues.cols);

    const focusOnWholeTableX = rowClueAreaWidth + focusX
    const focusOnWholeTableY = colClueAreaHeight + focusY

    const isFocused = cellColIndex === focusOnWholeTableX && cellRowIndex === focusOnWholeTableY
    if (isFocused) {
        console.debug("Focused cell - x:" + cellColIndex + ", y:" + cellRowIndex);
    }

    return isFocused
}