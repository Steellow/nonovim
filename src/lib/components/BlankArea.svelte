<script>
  import {
    keyboardBuffer,
    leftClueAreaWidth,
    topClueAreaHeight,
  } from "$lib/state.svelte";
  import { getKeyboardBufferText } from "$lib/utils/keyboard_helper_utils";
  import { loop } from "$lib/utils/table_utils";

  let { width, height } = $props();
</script>

<table class="blank">
  <tbody>
    {#each loop(height) as y}
      <tr class="blank">
        {#each loop(width) as x}
          <td class="blank">
            {getKeyboardBufferText(x, y, keyboardBuffer, topClueAreaHeight)}
          </td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>

<style>
  table.blank,
  td.blank {
    /* Same as background color, to keep the spacing right */
    border: 1px solid white;
  }
</style>
