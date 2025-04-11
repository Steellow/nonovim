interface TableAttrs {
	rows: number;
	cols: number;
}

// Represents all clues for a row or column
type ClueSet = number[];

interface Clues {
	top: ClueSet[];
	left: ClueSet[];
}

interface ClueWithState {
	clue: number;
	crossed?: boolean;
}

/**
 * Array of clues for a single row or column
 */
type ClueSetWithState = ClueWithState[];

interface CluesWithState {
	top: ClueSetWithState[];
	left: ClueSetWithState[];
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
	pendingAction: CellState | null;

	// If user is appending current cell state
	// (like pressing F again on filled cell)
	appending: boolean;
	appendingDirection?: MoveDirection;
}

type CellValue = number | '×' | null;

type ActionKeyCodes = 's' | 'd' | 'f';

type MoveDirection = 'left' | 'right' | 'up' | 'down';

// cell size html style object, contains width & height in pixels
interface CellSize {
	width: string;
	height: string;
}

type CluesPosition = 'top' | 'left';
