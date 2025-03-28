import { isBlankCell, isFilledCell, isFocusedRowOrCol, isPlayerPosition } from "./table_utils"

export function getCellCssClass(
    clueValue: number | null,
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

    if (clueValue !== null) {
        classes.push("clue")
    }

    if (isFilledCell(rowIndex, colIndex, gameBoard, constants)) {
        classes.push("filled")
    }


    return classes.join(" ")
}
