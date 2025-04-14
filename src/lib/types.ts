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

// TODO: These are good when handling values, but actualy array should probably only contain integers for performance?
type CellState = "empty" | "filled" | "x";

// Represents the game board grid
type GameBoard = CellState[][];

interface PlayerPosition {
  x: number;
  y: number;
}

interface KeyboardBuffer {
  repeat: number;
  pendingAction: CellState | null;

  appending: CellState | null;
  appendDirection: MoveDirection | null;
  appendAmount: number;
}

type CellValue = number | "×" | null;

type ActionKeyCodes = "s" | "d" | "f";

type MoveDirection = "left" | "right" | "up" | "down";

// cell size html style object, contains width & height in pixels
interface CellSize {
  width: string;
  height: string;
}

type CluesPosition = "top" | "left";

type LineNumbersPosition = "right" | "bottom";
