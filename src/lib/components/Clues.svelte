<script lang="ts">
	import {
		clues,
		gameHeight,
		gameWidth,
		leftClueAreaWidth,
		topClueAreaHeight
	} from '$lib/state.svelte';
	import { loop } from '$lib/utils/table_utils';

	let {
		cluesPosition
	}: {
		cluesPosition: CluesPosition;
	} = $props();

	const tableHeight = $derived(cluesPosition === 'top' ? topClueAreaHeight : gameHeight);
	const tableWidth = $derived(cluesPosition === 'top' ? gameWidth : leftClueAreaWidth);

	const cluesForThisComponent = $derived(cluesPosition === 'top' ? clues.top : clues.left);

	// Returns the clue which should be shown in cell,
	// if no clue in that cell, returns null
	const getClue = (
		clues: ClueSetWithState[],
		nthClueFromLeft: number,
		nthClueFromTop: number,
		cluesPosition: CluesPosition
	): ClueWithState | null =>
		cluesPosition === 'top'
			? getTopClue(clues, nthClueFromLeft, nthClueFromTop)
			: getLeftClue(clues, nthClueFromLeft, nthClueFromTop);

	const getTopClue = (
		clues: ClueSetWithState[],
		nthClueFromLeft: number,
		nthClueFromTop: number
	): ClueWithState | null => {
		const cluesForThisColumn = clues[nthClueFromLeft];
		const offset = topClueAreaHeight - cluesForThisColumn.length;

		if (nthClueFromTop < offset) {
			return null;
		}

		return cluesForThisColumn[nthClueFromTop - offset];
	};

	const getLeftClue = (
		clues: ClueSetWithState[],
		nthClueFromLeft: number,
		nthClueFromTop: number
	): ClueWithState | null => {
		const cluesForThisRow = clues[nthClueFromTop];
		const offset = leftClueAreaWidth - cluesForThisRow.length;

		if (nthClueFromLeft < offset) {
			return null;
		}

		return cluesForThisRow[nthClueFromLeft - offset];
	};
</script>

<table>
	<tbody>
		{#each loop(tableHeight) as nthClueFromTop}
			<tr>
				{#each loop(tableWidth) as nthClueFromLeft}
					<td class="clue">
						{getClue(cluesForThisComponent, nthClueFromLeft, nthClueFromTop, cluesPosition)?.clue}
					</td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>

<style>
	td.clue-crossed {
		position: relative;
		color: grey;
	}

	td.clue-crossed::before {
		position: absolute;
		content: '';
		left: 15%;
		top: 50%;
		right: 15%;
		border-top: 1px solid black !important;

		-webkit-transform: rotate(-45deg);
		-moz-transform: rotate(-45deg);
		-ms-transform: rotate(-45deg);
		-o-transform: rotate(-45deg);
		transform: rotate(-45deg);
	}
</style>
