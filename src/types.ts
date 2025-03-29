interface TableAttrs {
    rows: number;
    cols: number;
}

// Represents all clues for a row or column
type ClueSet = number[]

interface NonogramClues {
    top: ClueSet[],
    left: ClueSet[]
}

// Represents the state of a single cell (e.g., 0: empty, 1: filled, 2: marked 'X')
type CellState = 0 | 1 | 2;

// Represents the game board grid
type GameBoard = CellState[][];

interface PlayerPosition {
    x: number;
    y: number;
}

interface KeyboardBuffer {
    repeat: number;
    pendingAction: CellState | null
}

interface GameConstants {
    cellSize: number;
    rowClueAreaWidth: number;
    colClueAreaHeight: number;
    gameWidth: number;
    gameHeight: number;
}

type CellValue = number | "×" | null

type ActionKeyCodes = "KeyS" | "KeyD" | "KeyF"

type MoveDirection = "left" | "right" | "up" | "down"