<script>
  import Cover from "../components/Overview/Cover.svelte";
  import Objectives from "../components/Overview/Objectives.svelte";
  import Methodology from "../components/Overview/Methodology.svelte";
  import Dataset from "../components/Overview/Dataset.svelte";
  import Participants from "../components/Overview/Participants.svelte";
</script>

<div class="spectacular-container">
  <Cover />
  <Objectives />
  <Methodology />
  <Participants/>
  <Dataset />
</div>

<style>
  .spectacular-container {
    position: relative;
    background: radial-gradient(
        circle at 20% 100%,
        rgba(0, 212, 255, 0.1) 0%,
        rgba(0, 212, 255, 0.08) 30%,
        rgba(0, 212, 255, 0.05) 50%,
        rgba(0, 212, 255, 0.02) 70%,
        transparent 90%
      ),
      radial-gradient(
        circle at 80% 8%,
        rgba(255, 107, 0, 0.08) 0%,
        transparent 35%
      ),
      radial-gradient(
        circle at 45% 45%,
        rgba(255, 107, 0, 0.08) 0%,
        transparent 30%
      ),
      linear-gradient(135deg, #0a0a15 0%, #1a1a2e 50%, #16213e 100%);
    box-shadow:
      0 0 50px rgba(0, 212, 255, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
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
