export function getCellCssClass(isBlank: boolean, isFocused: boolean, clueValue: number | null): cellCssClass {
    if (isBlank) {
        return "blank"
    }

    if (isFocused) {
        return "focused"
    }

    if (clueValue !== null) {
        return "clue"
    }

    return ""
}