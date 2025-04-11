<script lang="ts">
	import { gameHeight, gameWidth, keyboardBuffer } from '$lib/state.svelte';
	import { gameBoard, playerPosition } from '$lib/state.svelte';
	import { loop } from '$lib/utils/table_utils';

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
		gameBoard: GameBoard,
		position: PlayerPosition,
		tableY: number,
		tableX: number,
		keyboardBuffer: KeyboardBuffer,
		appendNumber: string | null
	): string => {
		let classes = '';

		if (isPlayerPosition(tableY, tableX, position)) {
			classes += ' player-position';
		}

		if (isFocusedRowOrCol(tableY, tableX, position)) {
			classes += ' focused';
		}

		const cellState = getCellState(tableY, tableX, gameBoard);
		if (cellState === 1) {
			classes += ' filled';
		} else if (cellState === 2) {
			classes += ' crossed';
		}

		// if (keyboardBuffer.appending && keyboardBuffer.appendingDirection === undefined) {
		// 	classes += getAppendingCursorClass(position, tableY, tableX);
		// }

		if (appendNumber) {
			classes += ' appending';
		}

		return classes;
	};

	const isPlayerPosition = (
		cellRowIndex: number,
		cellColIndex: number,
		playerPosition: PlayerPosition
	) => cellColIndex === playerPosition.x && cellRowIndex === playerPosition.y;

	const isFocusedRowOrCol = (
		cellRowIndex: number,
		cellColIndex: number,
		playerPosition: PlayerPosition
	) => cellColIndex === playerPosition.x || cellRowIndex === playerPosition.y;

	const getCellState = (rowIndex: number, colIndex: number, gameBoard: GameBoard): CellState =>
		gameBoard[rowIndex][colIndex];
</script>

<table>
	<tbody>
		{#each loop(gameHeight) as y}
			<tr>
				{#each loop(gameWidth) as x}
					<td class={getCellClasses(gameBoard, playerPosition, y, x, keyboardBuffer, null)}></td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>

<style>
	td.crossed::after {
		content: '×';
	}

	td.player-position {
		position: relative;
		background-color: rgb(240, 240, 240);
	}

	td.player-position::after {
		content: '×';
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
		content: '';
	}

	td.filled {
		background-color: rgb(69, 69, 69);
		box-shadow: inset 0 0 0 2px white;
	}
</style>
