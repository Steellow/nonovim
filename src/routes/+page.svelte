<script lang="ts">
  import Clues from "$lib/components/Clues.svelte";
  import GameBoard from "$lib/components/GameBoard.svelte";
  import LineNumbers from "$lib/components/LineNumbers.svelte";
  import { leftClueAreaWidth, topClueAreaHeight } from "$lib/state.svelte";
  import { handleKeydown } from "$lib/utils/keyboard_handler.svelte";
  import "../app.css";
  import BlankArea from "$lib/components/BlankArea.svelte";
  import HelpDialog from "$lib/components/HelpDialog.svelte";

  $effect.root(() => {
    console.log("Adding global keydown listener");
    window.addEventListener("keydown", handleKeydown);

    return () => {
      console.log("Removing global keydown listener");
      window.removeEventListener("keydown", handleKeydown);
    };
  });

  // TODO: just use runes here, instead of store? or state.svelte.ts?
  // see https://svelte.dev/docs/svelte/stores
</script>

<div class="row">
  <BlankArea width={leftClueAreaWidth} height={topClueAreaHeight} />
  <Clues cluesPosition="top" />
</div>
<div class="row">
  <Clues cluesPosition="left" />
  <GameBoard />
  <LineNumbers lineNumbersPosition="right" />
  <HelpDialog />
</div>
<div class="row">
  <BlankArea width={leftClueAreaWidth} height={1} />
  <LineNumbers lineNumbersPosition="bottom" />
</div>
