<script>
  import Cover from "./overview/Cover.svelte";
  import Objectives from "./overview/Objectives.svelte";
  import Methodology from "./overview/Methodology.svelte";
  import Dataset from "./overview/Dataset.svelte";
    import Participants from "./Participants.svelte";
</script>

<div class="spectacular-container">
  <Cover/>
  <Objectives/>
  <Participants/>
  <Methodology/>
  <Dataset/>
</div>

<style>
  .spectacular-container {
    position: relative;
    background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
    overflow: hidden;
  }

  .spectacular-container::before {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;
  }
</style>