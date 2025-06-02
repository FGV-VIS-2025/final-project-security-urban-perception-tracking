<script>
  import TabNavigation from "../components/TabNavigation.svelte";
  import InfoTab from "../components/InfoTab.svelte";
  import SliderTab from "../components/SliderTab.svelte";
  import MapTab from "../components/MapTab.svelte";
  import TemporalExplorerTab from "../components/TemporalExplorerTab.svelte";
  import { activeTab, config } from "../stores/appStore.js";
  
  $: currentConfig = $config;
</script>

<div class="app-container">
  <div class="floating-orb orb-1"></div>
  <div class="floating-orb orb-2"></div>
  <TabNavigation />
  <main class="main-content">
    <div class="top-bar">
      <div>
        <div class="page-title">{currentConfig.paperTitle}</div>
        <div class="page-subtitle">{currentConfig.paperSubtitle}</div>
      </div>
    </div>

    <div class="content">
      {#if $activeTab === "info"}
        <InfoTab />
      {:else if $activeTab === "temporal"}
        <TemporalExplorerTab />
      {:else if $activeTab === "slider"}
        <SliderTab />
      {:else if $activeTab === "map"}
        <MapTab />
      {/if}
    </div>
  </main>
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
    min-height: 100vh;
    font-family:
      "Inter",
      -apple-system,
      BlinkMacSystemFont,
      sans-serif;
    color: #ffffff;
    overflow-x: hidden;
  }

  .app-container {
    display: flex;
    min-height: 100vh;
    position: relative;
  }

  .main-content {
    margin-left: 280px;
    flex: 1;
    padding: 2rem;
    position: relative;
    min-height: 100vh;
  }

  .top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding: 1.5rem 2rem;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(20px);
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    flex-wrap: wrap;
    gap: 1rem;
  }

  .page-title {
    font-size: 1.8rem;
    font-weight: 700;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 0.2rem;
  }

  .page-subtitle {
    font-size: 0.9rem;
    opacity: 0.7;
    margin-top: 0.2rem;
  }

  .content {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    padding: 2rem;
    min-height: calc(100vh - 200px);
    position: relative;
    overflow: hidden;
    animation: fadeIn 0.5s ease;
  }

  .content::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #667eea, #764ba2);
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .floating-orb {
    position: fixed;
    width: 150px;
    height: 150px;
    background: radial-gradient(
      circle,
      rgba(102, 126, 234, 0.08) 0%,
      transparent 70%
    );
    border-radius: 50%;
    pointer-events: none;
    animation: float 8s ease-in-out infinite;
    z-index: 1;
  }

  .orb-1 {
    top: 10%;
    right: 20%;
    animation-delay: 0s;
  }

  .orb-2 {
    bottom: 20%;
    right: 10%;
    animation-delay: 4s;
  }

  @keyframes float {
    0%,
    100% {
      transform: translateY(0px) scale(1);
      opacity: 0.6;
    }
    50% {
      transform: translateY(-15px) scale(1.05);
      opacity: 0.8;
    }
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .main-content {
      margin-left: 0;
      padding: 1rem;
    }

    .top-bar {
      padding: 1rem;
    }

    .content {
      padding: 1rem;
    }

    .page-title {
      font-size: 1.5rem;
    }
  }
</style>