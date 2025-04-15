<script lang="ts">
  import { gameHeight, gameWidth, keyboardBuffer } from "$lib/state.svelte";
  import { gameBoard, playerPosition } from "$lib/state.svelte";
  import { loop } from "$lib/utils/table_utils";

  const getCellClasses = (
    tableY: number,
    tableX: number,
    appendValue: string | null
  ): string => {
    let classes = "";

    if (isPlayerPosition(tableY, tableX)) {
      classes += " player-position";
    }

    if (isFocusedRowOrCol(tableY, tableX)) {
      classes += " focused";
    }

    const cellState = getCellState(tableY, tableX);
    if (cellState === "filled") {
      classes += " filled";
    } else if (cellState === "x") {
      classes += " crossed";
    }

    // Appending + value in cell
    if (appendValue === "") {
      classes += " ghost";
    } else if (appendValue !== null) {
      classes += " appending";

      // Appending, ghost cell
    } else if (keyboardBuffer.appendDirection !== null) {
    }

    return classes;
  };

  const isPlayerPosition = (tableY: number, tableX: number) =>
    tableX === playerPosition.x && tableY === playerPosition.y;

  const isFocusedRowOrCol = (tableY: number, tableX: number) =>
    isFocusedCol(tableX) || isFocusedRow(tableY);

  const isFocusedRow = (tableY: number) => tableY === playerPosition.y;

  const isFocusedCol = (tableX: number) => tableX === playerPosition.x;

  const getCellState = (rowIndex: number, colIndex: number): CellState =>
    gameBoard[rowIndex][colIndex];

  const getAppendingCellValue = (
    tableY: number,
    tableX: number
  ): string | null => {
    if (!keyboardBuffer.appending) {
      return null;
    }

    // 1. Appending just started
    if (keyboardBuffer.appendDirection === null) {
      return getAppendHJKLGuides(tableY, tableX);

      // 2. Direction choosed → show numbers
    } else {
      return getAppendNumbersAndGhostCells(tableY, tableX);
    }
  };

  const getAppendHJKLGuides = (
    tableY: number,
    tableX: number
  ): MoveKeys | null => {
    if (playerPosition.y === tableY) {
      if (playerPosition.x === tableX - 1) {
        return "L";
      } else if (playerPosition.x === tableX + 1) {
        return "H";
      }
    } else if (playerPosition.x === tableX) {
      if (playerPosition.y === tableY - 1) {
        return "J";
      } else if (playerPosition.y === tableY + 1) {
        return "K";
      }
    }
    return null;
  };

  const getAppendNumbersAndGhostCells = (
    tableY: number,
    tableX: number
  ): string | null => {
    let amount = null;

    const { x: playerX, y: playerY } = playerPosition;
    const { appendDirection, repeat } = keyboardBuffer;

    switch (appendDirection) {
      case "left":
        if (tableY === playerY && tableX < playerX) {
          amount = playerX - tableX;
        }
        break;

      case "right":
        if (tableY === playerY && tableX > playerX) {
          amount = tableX - playerX;
        }
        break;

      case "up":
        if (tableX === playerX && tableY < playerY) {
          amount = playerY - tableY;
        }
        break;

      case "down":
        if (tableX === playerX && tableY > playerY) {
          amount = tableY - playerY;
        }
        break;
    }

    if (amount !== null) {
      // Return distance string or "" (ghost cell)
      return amount > repeat ? (amount + 1).toString() : "";
    }

    return null;
  };
</script>

<table>
  <tbody>
    {#each loop(gameHeight) as y}
      <tr>
        {#each loop(gameWidth) as x}
          {@const appendValue = getAppendingCellValue(y, x)}
          <td class={getCellClasses(y, x, appendValue)}>{appendValue}</td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>

<style>
  td.crossed::after {
    content: "×";
  }

  td.player-position {
    position: relative;
    background-color: rgb(240, 240, 240);
  }

  td.player-position::after {
    content: "×";
    position: absolute;
    inset: -4px;
    border: 4px solid red;
    z-index: 1;
    pointer-events: none;

    /* Center the "×" */
    display: flex;
    align-items: center;
    justify-content: center;
  }

  td.player-position:not(.crossed)::after {
    content: "";
  }

  td.filled {
    background-color: rgb(69, 69, 69) !important;
    box-shadow: inset 0 0 0 2px white;
    color: white;
  }

  td.ghost {
    background-color: rgb(111, 111, 111) !important;
    box-shadow: inset 0 0 0 2px white;
  }

  td.appending {
    background-color: lightskyblue;
    box-shadow: inset 0 0 0 2px white;
  }
</style>
