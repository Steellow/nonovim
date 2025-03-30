import { getCellState, isFocusedRowOrCol, isPlayerPosition } from "./table_utils"

export function getCellCssClass(
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

export const getCellSize = (size: number) => ({ height: `${size}px`, width: `${size}px` });

