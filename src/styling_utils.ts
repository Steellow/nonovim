export function getCellCssClass(isBlank: boolean, isPlayerPosition: boolean,
    isFocusedRowOrColumn: boolean, clueValue: number | null): CellCssClass {
    if (isBlank) {
        return "blank"
    }

    if (isPlayerPosition) {
        return "player-position"
    }

    if (isFocusedRowOrColumn) {
        return "focused"
    }

    if (clueValue !== null) {
        return "clue"
    }

    return ""
}