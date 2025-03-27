// Returns true if UI should be redrawn
export function handleKeyPress(e: KeyboardEvent, state: GameState): boolean {
    e.preventDefault()

    switch (e.code) {
        case "KeyH":
            state.x -= 1
            return true

        case "KeyJ":
            state.y += 1
            return true

        case "KeyK":
            state.y -= 1
            return true

        case "KeyL":
            state.x += 1
            return true
    }

    return false
}

