import { getGameboardColumnStatesAsArray } from "./gameboard_utils"

export const initCluesWithState = (clues: Clues): CluesWithState => {
    const top = clues.top.map(clueSet =>
        clueSet.map(clue =>
        ({
            clue: clue,
            crossed: false
        })
        )
    )

    const left = clues.left.map(clueSet =>
        clueSet.map(clue =>
        ({
            clue: clue,
            crossed: false
        })
        )
    )

    return { top, left }
}

export const getClueClasses = (
    tableIndex: number,
    playerPosition: number,
    clue: ClueWithState | null,
): string => {
    const classes = []

    if (isFocusedColumn(tableIndex, playerPosition)) {
        classes.push("focused")
    }

    if (clue?.crossed) {
        classes.push("clue-crossed")
    }

    return classes.join(" ")
}

/**
 * 
 * @param tableIndex if top clues, use `nthClueFromLeft`, if left clues, use `nthClueFromTop`
 * @param playerPosition if top clues, use X, if left clues, use Y
 * @returns 
 */
export const isFocusedColumn = (tableIndex: number, playerPosition: number): boolean =>
    tableIndex === playerPosition

export const checkCluesForRowAndColumn = (clues: CluesWithState, gameBoard: CellState[][], playerPosition: PlayerPosition) => {
    const { x, y } = playerPosition
    checkSingleRowClues(clues.left[y], gameBoard[y])
    checkSingleRowClues(clues.top[x], getGameboardColumnStatesAsArray(gameBoard, x))
}

// Checks if clues are crossed for single column or row
export const checkSingleRowClues = (clues: ClueWithState[], gameBoardRow: CellState[]) => {
    console.debug("checkSingleRowClues called")

    resetClueStates(clues)

    let mismatchingSequenceFound = false
    const sequences = getRowFilledCellSequences(gameBoardRow)
    sequences.forEach((sequenceLength, index) => {
        if (mismatchingSequenceFound) {
            return
        }

        const clue = clues[index]
        if (clue.clue === sequenceLength) {
            clue.crossed = true
        } else {
            mismatchingSequenceFound = true
            return
        }
    })

    if (sequences.length < clues.length) {
        checkSingleRowCluesReversed(clues, gameBoardRow)
    }
}

// checkSingleRowClues, but starts form the other end 
const checkSingleRowCluesReversed = (clues: ClueWithState[], gameBoardRow: CellState[]) => {
    console.debug("checkSingleRowCluesReversed called")

    let mismatchingSequenceFound = false
    const sequences = getRowFilledCellSequences([...gameBoardRow].reverse())

    sequences.forEach((sequenceLength, index) => {
        if (mismatchingSequenceFound) {
            return
        }

        const clue = clues[clues.length - 1 - index]
        if (clue.clue === sequenceLength) {
            clue.crossed = true
        } else {
            mismatchingSequenceFound = true
            return
        }
    })
}

/**
 * Finds fill sequences of the row/column, until the first empty cell
 * For example, row ×■■×■×■■■■×■■ would return [2, 1, 4]
 * (or [2, 1, 4, 2] if the last ■■ is at the edge of the board)
 */
const getRowFilledCellSequences = (gameBoardRow: CellState[]): number[] => {
    let abort = false

    let isSequence = false
    let sequenceLength = 0

    const checkedSequences: number[] = []

    gameBoardRow.forEach((state, index) => {
        // If no fill or cross, don't handle rest of the clues
        if (state === 0) {
            abort = true
            return
        }
        if (abort) {
            return
        }

        if (state === 1) {
            isSequence = true
            sequenceLength++

            // If last cell → don't check for remaining cross
            if (index === gameBoardRow.length - 1) {
                checkedSequences.push(sequenceLength)
                return
            }
        }

        if (state === 2) {
            if (isSequence) {
                checkedSequences.push(sequenceLength)
                isSequence = false
                sequenceLength = 0
            }
        }

    })

    return checkedSequences
}

const resetClueStates = (clues: ClueWithState[]) => {
    clues.forEach(clue => {
        clue.crossed = false
    })
}

/**
 * Returns the maximum length among all clue arrays in a set.
 * Example: maxClues([[1], [2, 3], [4]]) returns 2.
 */
export const getMaxClueLength = (clues: ClueSet[]): number => clues.reduce(
    (longestSoFar, currentArray) =>
        currentArray.length > longestSoFar.length ? currentArray : longestSoFar,
    clues[0]).length

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