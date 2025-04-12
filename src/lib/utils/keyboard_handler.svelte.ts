import {
  clues,
  gameHeight,
  gameWidth,
  keyboardBuffer,
} from "$lib/state.svelte";
import { gameBoard, playerPosition } from "$lib/state.svelte";

export const handleKeydown = (e: KeyboardEvent) => {
  e.preventDefault();

  const key = e.key.toLocaleLowerCase();
  console.debug("Key pressed (lowercased):", key);

  // <num> already pressed, then <action>
  if (keyboardBuffer.repeat > 1 && actionKeyPressed(e.key)) {
    storeAction(key as ActionKeyCodes, keyboardBuffer);
    console.debug(keyboardBuffer);
    return;
  }

  switch (key) {
    // Basic movement (HJKL)
    case "h":
    case "arrowleft":
      move("left");
      break;

    case "j":
    case "arrowdown":
      move("down");
      break;

    case "k":
    case "arrowup":
      move("up");
      break;

    case "l":
    case "arrowright":
      move("right");
      break;

    // Basic cell action (fill, cross, clear)
    case "f":
      changeCellState(1, true);
      break;

    case "d":
      changeCellState(2, true);
      break;

    case "s":
      changeCellState(0, true);
      break;

    default:
      // Store repeat action
      if (!Number.isNaN(key)) {
        keyboardBuffer.repeat = Number(key);
        return;
      }
      break;
  }
};

const actionKeyPressed = (key: string) => ["s", "d", "f"].includes(key);

const storeAction = (key: ActionKeyCodes, keyboardBuffer: KeyboardBuffer) => {
  switch (key) {
    case "s":
      keyboardBuffer.pendingAction = 0;
      break;

    case "d":
      keyboardBuffer.pendingAction = 2;
      break;

    case "f":
      keyboardBuffer.pendingAction = 1;
      break;

    default:
      console.error("Cannot store action " + key);
      break;
  }
};

/**
 * Moves player to given direction x times (times from keyboardBuffer)
 * Also checks clue states
 * @param position current player position
 * @param keyboardBuffer moves `repeat` amount, also changes cell state if `pendingAction` is not null
 */
const move = (direction: MoveDirection) => {
  const boundaryCheck = getMovementBoundaryCheck(direction, playerPosition);

  // Save pending action and remove it from state
  const pendingAction = keyboardBuffer.pendingAction;
  keyboardBuffer.pendingAction = null;

  // When painting multiple cells at a time,
  // also paint the starting position
  if (pendingAction !== null) {
    changeCellState(pendingAction);
  }

  // Repeat movement x times
  for (let i = 0; i < keyboardBuffer.repeat; i++) {
    if (boundaryCheck()) {
      moveToDirection(direction);

      // If pending action in keyboard buffer
      if (pendingAction !== null) {
        changeCellState(pendingAction, i === keyboardBuffer.repeat - 1);
      }
    } else {
      break;
    }
  }

  keyboardBuffer.repeat = 1;
};

const getMovementBoundaryCheck = (
  direction: MoveDirection,
  position: PlayerPosition
): (() => boolean) => {
  switch (direction) {
    case "left":
      return () => position.x > 0;

    case "right":
      return () => position.x < gameWidth - 1;

    case "up":
      return () => position.y > 0;

    case "down":
      return () => position.y < gameHeight - 1;
  }
};

/**
 * Changes cell state (0=empty, 1=filled, 2=crossed) at a given position
 * If clues are provided and shouldCheckClues = true, also checks if any clues should be crossed
 */
const changeCellState = (
  state: CellState,
  shouldCheckClues: boolean = false
): boolean => {
  gameBoard[playerPosition.y][playerPosition.x] = state;

  if (shouldCheckClues) {
    checkCluesForRowAndColumn();
  }

  return true;
};

const checkCluesForRowAndColumn = () => {
  const { x, y } = playerPosition;
  checkSingleRowClues(clues.left[y], gameBoard[y]);
  checkSingleRowClues(
    clues.top[x],
    getGameboardColumnStatesAsArray(gameBoard, x)
  );
};

// Checks if clues are crossed for single column or row
const checkSingleRowClues = (
  clueSet: ClueSetWithState,
  gameBoardRow: CellState[]
) => {
  resetClueStates(clueSet);

  let mismatchingSequenceFound = false;
  const sequences = getRowFilledCellSequences(gameBoardRow);
  sequences.forEach((sequenceLength, index) => {
    if (mismatchingSequenceFound) {
      return;
    }

    const clue = clueSet[index];
    if (clue.clue === sequenceLength) {
      clue.crossed = true;
    } else {
      mismatchingSequenceFound = true;
      return;
    }
  });

  if (sequences.length < clueSet.length) {
    checkSingleRowCluesReversed(clueSet, gameBoardRow);
  }
};

const resetClueStates = (rowClues: ClueWithState[]) => {
  rowClues.forEach((clue) => {
    clue.crossed = false;
  });
};

/**
 * Same as checkSingleRowClues, but starts from the other end
 * @param clueSet clues for that row or column
 * @param gameBoardRow array of cell states for that row or column
 */
const checkSingleRowCluesReversed = (
  clueSet: ClueSetWithState,
  gameBoardRow: CellState[]
) => {
  console.debug("checkSingleRowCluesReversed called");

  let mismatchingSequenceFound = false;
  const sequences = getRowFilledCellSequences([...gameBoardRow].reverse());

  sequences.forEach((sequenceLength, index) => {
    if (mismatchingSequenceFound) {
      return;
    }

    const clue = clueSet[clueSet.length - 1 - index];
    if (clue.clue === sequenceLength) {
      clue.crossed = true;
    } else {
      mismatchingSequenceFound = true;
      return;
    }
  });
};

/**
 * Finds fill sequences of the row/column, until the first empty cell
 * For example, row ×■■×■×■■■■×■■ would return [2, 1, 4]
 * (or [2, 1, 4, 2] if the last ■■ is at the edge of the board)
 */
const getRowFilledCellSequences = (gameBoardRow: CellState[]): number[] => {
  let abort = false;

  let isSequence = false;
  let sequenceLength = 0;

  const checkedSequences: number[] = [];

  gameBoardRow.forEach((state, index) => {
    // If no fill or cross, don't handle rest of the clues
    if (state === 0) {
      abort = true;
      return;
    }
    if (abort) {
      return;
    }

    if (state === 1) {
      isSequence = true;
      sequenceLength++;

      // If last cell → don't check for remaining cross
      if (index === gameBoardRow.length - 1) {
        checkedSequences.push(sequenceLength);
        return;
      }
    }

    if (state === 2) {
      if (isSequence) {
        checkedSequences.push(sequenceLength);
        isSequence = false;
        sequenceLength = 0;
      }
    }
  });

  return checkedSequences;
};

/**
 * @param gameBoard Full gameboard state
 * @param xPosition Player position on the X axis
 * @returns Array of cell state values in a column in xPosition
 */
const getGameboardColumnStatesAsArray = (
  gameBoard: CellState[][],
  xPosition: number
): CellState[] => gameBoard.map((row) => row[xPosition]);

const moveToDirection = (direction: MoveDirection) => {
  switch (direction) {
    case "left":
      playerPosition.x = playerPosition.x - 1;
      break;
    case "right":
      playerPosition.x++;
      break;
    case "up":
      playerPosition.y = playerPosition.y - 1;
      break;
    case "down":
      playerPosition.y++;
      break;
  }
  console.log(playerPosition.x + ", " + playerPosition.y);
};
