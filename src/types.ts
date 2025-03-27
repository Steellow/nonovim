interface TableAttrs {
    rows: number;
    cols: number;
}

// Represents all clues for a row or column
type ClueSet = number[]

interface NonogramClues {
    cols: ClueSet[],
    rows: ClueSet[]
}

// Represents the state of a single cell (e.g., 0: empty, 1: filled, 2: marked 'X')
type CellState = 0 | 1 | 2;

// Represents the game board grid
type GameBoard = CellState[][];

interface GameState {
    clues: NonogramClues;
    gameBoard: GameBoard;
    x: number; // Current focus col index
    y: number; // Current focus row index
    keyboardBuffer: KeyboardBuffer;
    constants: GameConstants;
    keyboardHandler: (event: KeyboardEvent) => void;
}

interface KeyboardBuffer {
    repeat: number
}

interface GameConstants {
    cellSize: number;
    rowClueAreaWidth: number;
    colClueAreaHeight: number;

    // Table total size containing board, clues and empty area
    tableTotalHeight: number;
    tableTotalWidth: number;
}

type CellCssClass = "blank" | "clue" | "focused" | ""

type MoveDirection = "left" | "right" | "up" | "down"