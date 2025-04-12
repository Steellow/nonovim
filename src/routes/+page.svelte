<script lang="ts">
	import Clues from '$lib/components/Clues.svelte';
	import GameBoard from '$lib/components/GameBoard.svelte';
	import LeftTopBlankArea from '$lib/components/LeftTopBlankArea.svelte';
	import { handleKeydown } from '$lib/utils/keyboard_handler.svelte';
	import "../app.css"

	$effect.root(() => {
		console.log('Adding global keydown listener');
		window.addEventListener('keydown', handleKeydown);

		return () => {
			console.log('Removing global keydown listener');
			window.removeEventListener('keydown', handleKeydown);
		};
	});

	// TODO: just use runes here, instead of store? or state.svelte.ts?
	// see https://svelte.dev/docs/svelte/stores
</script>

<div class="row">
	<LeftTopBlankArea />
	<Clues cluesPosition="top" />
</div>
<div class="row">
	<Clues cluesPosition="left" />
	<GameBoard />
</div>
