<script lang="ts">
  import { gameHeight, gameWidth, keyboardBuffer } from "$lib/state.svelte";
  import { gameBoard, playerPosition } from "$lib/state.svelte";
  import { loop } from "$lib/utils/table_utils";

  // let localPlayerPosition = $state<PlayerPosition>(get(playerPosition))
  // $effect(() => {
  // 	console.log("Setting up playerPositionStore subscription");
  // 	const unsubscribe = playerPosition.subscribe(newValue => {
  //   console.log("playerPositionStore updated:", newValue);
  //   // Assign the new value to the $state variable. This assignment
  //   // is tracked by Svelte 5 because 'playerPosition' uses $state.
  //   localPlayerPosition = newValue;
  // });

  // // The effect's cleanup function: Unsubscribe when the component unmounts
  // // or when the effect re-runs (though this one likely won't re-run)
  // return () => {
  //   console.log("Cleaning up playerPositionStore subscription");
  //   unsubscribe();
  // };
  // })

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

    if (appendValue !== null) {
      classes += " appending";
    }

    return classes;
  };

  const isPlayerPosition = (cellRowIndex: number, cellColIndex: number) =>
    cellColIndex === playerPosition.x && cellRowIndex === playerPosition.y;

  const isFocusedRowOrCol = (cellRowIndex: number, cellColIndex: number) =>
    cellColIndex === playerPosition.x || cellRowIndex === playerPosition.y;

  const getCellState = (rowIndex: number, colIndex: number): CellState =>
    gameBoard[rowIndex][colIndex];

  const getAppendingCellValue = (
    tableY: number,
    tableX: number
  ): string | null => {
    if (keyboardBuffer.appending === null) {
      return null;
    }

    // 1. Appending just started
    if (keyboardBuffer.appendDirection === null) {
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
    }

    // 2. Direction choosed → show numbers
    switch (keyboardBuffer.appendDirection) {
      case "left":
        if (tableY === playerPosition.y && tableX < playerPosition.x) {
          return (playerPosition.x - tableX).toString();
        }
        break;

      case "right":
        if (tableY === playerPosition.y && tableX > playerPosition.x) {
          return (tableX - playerPosition.x).toString();
        }
        break;

      case "up":
        if (tableX === playerPosition.x && tableY < playerPosition.y) {
          return (playerPosition.y - tableY).toString();
        }
        break;

      case "down":
        if (tableX === playerPosition.x && tableY > playerPosition.y) {
          return (tableY - playerPosition.y).toString();
        }
        break;
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

  td.appending {
    background-color: lightskyblue;
    box-shadow: inset 0 0 0 2px white;
  }
</style>
