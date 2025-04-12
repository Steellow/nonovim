<script>
  import { keyboardBuffer } from "$lib/state.svelte";

  const moveTextClass = $derived(keyboardBuffer.repeat > 1 ? "bold" : "");
  const actionTextClass = $derived(
    keyboardBuffer.repeat > 1 && keyboardBuffer.pendingAction === null
      ? "bold"
      : ""
  );
</script>

<div class="help">
  <p class={moveTextClass}>[HJKL] to move</p>
  <p class={actionTextClass}>[FDS] to change cell</p>
  <p class="sub">F = fill cell</p>
  <p class="sub">D = cross cell</p>
  <p class="sub">S = clear cell</p>
  <p class="divider">&lt;num&gt; to repeat action</p>
  <p class="sub">3J = move down 3</p>
  <p class="sub">3FJ = move down 3 & fill cells</p>
</div>

<style>
  .help {
    margin-left: 20px;
    border: 1px solid black;
  }

  .help p {
    margin: 5px 10px 5px 10px;
  }

  .help p.sub {
    margin: 0px 10px 0px 20px;
  }

  .help p.divider {
    padding-top: 5px;
    border-top: 1px dotted black;
  }

  .help p.bold {
    font-weight: bolder;
  }
</style>
