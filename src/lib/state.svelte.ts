import { getMaxClueLength, initCluesWithState } from "./utils/clue_utils";
import { initializeEmptyBoard } from "./utils/gameboard_utils";

const initialClues: Clues = {
  top: [
    [1],
    [2, 3],
    [4, 1, 1],
    [1, 3],
    [1, 1, 1, 2],
    [1, 1, 2],
    [4, 1, 1],
    [1, 1],
    [1, 1],
    [5],
  ],
  left: [
    [3],
    [1, 1],
    [1, 1, 1],
    [3, 1],
    [5, 1],
    [1, 1, 1],
    [1, 4],
    [1, 1, 1],
    [1, 2, 2],
    [2, 3, 1],
  ],
};

export const clues: CluesWithState = initCluesWithState(initialClues);

export const playerPosition: PlayerPosition = $state({
  x: 0,
  y: 0,
});

export const gameBoard: GameBoard = $state(initializeEmptyBoard(initialClues));

export const leftClueAreaWidth = getMaxClueLength(initialClues.left);
export const topClueAreaHeight = getMaxClueLength(initialClues.top);
export const gameHeight = clues.left.length;
export const gameWidth = clues.top.length;
export const cellSize = 25;

export const keyboardBuffer: KeyboardBuffer = $state({
  repeat: 1,
  pendingAction: null,
  appending: null,
  appendDirection: null,
  appendAmount: 0,
});

// TODO: Scaling doesn't work properly at the moment
// const cellSize = 25
// if (document && cellSize) {
//     document.documentElement.style.setProperty("--td-width", `${cellSize}px`)
//     document.documentElement.style.setProperty("--td-height", `${cellSize}px`)
// }
