import { isFilledCell, isGameBoardArea } from "./table_utils"

export function getCellCssClass(
    isBlank: boolean,
    isPlayerPosition: boolean,
    isFocusedRowOrColumn: boolean,
    clueValue: number | null,
    gameBoard: GameBoard,
    position: PlayerPosition,
    rowIndex: number,
    colIndex: number,
    constants: GameConstants,
): string {

    const classes = []

    // TODO: Call table_utils.ts here!
    if (isBlank) {
        return "blank"
    }

    if (isPlayerPosition) {
        classes.push("player-position")
    }

    if (isFocusedRowOrColumn) {
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
