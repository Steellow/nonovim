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
    game: GameBoard;
    x: number; // Current focus col index
    y: number; // Current focus row index
    cellSize: number; // Setting, maybe move elsewhere?
}