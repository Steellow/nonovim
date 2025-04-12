<script lang="ts">
  import { gameHeight, gameWidth, playerPosition } from "$lib/state.svelte";
  import { loop } from "$lib/utils/table_utils";

  let {
    lineNumbersPosition,
  }: {
    lineNumbersPosition: LineNumbersPosition;
  } = $props();

  const positionXY: number = $derived(
    lineNumbersPosition === "right" ? playerPosition.y : playerPosition.x
  );

  const tableHeight = $derived(
    lineNumbersPosition === "right" ? gameHeight : 1
  );
  const tableWidth = $derived(lineNumbersPosition === "bottom" ? gameWidth : 1);

  const getRelativeLineNumber = (
    index: number,
    playerPositionY: number
  ): number => Math.abs(playerPositionY - index);
</script>

<table class="line-number">
  <tbody>
    {#each loop(tableHeight) as y}
      <tr class="line-number">
        {#each loop(tableWidth) as x}
          <td class="line-number">
            {getRelativeLineNumber(
              lineNumbersPosition === "right" ? y : x,
              positionXY
            )}
          </td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>

<style>
  table.line-number,
  tr.line-number,
  td.line-number {
    border: 1px solid white;
  }

  td.line-number {
    font-size: medium;
    background-color: white;
    color: green;
  }
</style>
