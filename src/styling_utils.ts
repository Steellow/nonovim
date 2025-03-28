import { isBlankCell, getCellState, isFocusedRowOrCol, isPlayerPosition } from "./table_utils"

export function getCellCssClass(
    cellValue: CellValue,
    gameBoard: GameBoard,
    position: PlayerPosition,
    rowIndex: number,
    colIndex: number,
    constants: GameConstants,
): string {

    const classes = []

    if (isBlankCell(rowIndex, colIndex, constants)) {
        return "blank"
    }

    if (isPlayerPosition(rowIndex, colIndex, position, constants)) {
        classes.push("player-position")
    }

    if (isFocusedRowOrCol(rowIndex, colIndex, position, constants)) {
        classes.push("focused")
    }

    if (typeof cellValue === "number") {
        classes.push("clue")
    }

    const cellState = getCellState(rowIndex, colIndex, gameBoard, constants)
    if (cellState === 1) {
        classes.push("filled")
    } else if (cellState === 2) {
        classes.push("crossed")
    }


    return classes.join(" ")
}
