<script>
  import { onMount } from 'svelte';
  import SliderTab from "../components/SliderTab.svelte";
  import MapTab from "../components/MapTab.svelte";
  import TemporalExplorerTab from "../components/TemporalExplorerTab.svelte";
  import TabNavigation from "../components/TabNavigation.svelte";
  import { currentRoute, initRouter } from "../stores/router.js";
  import { config } from "../stores/appStore.js";
  import InfoTab from '../components/InfoTab.svelte';
  
  $: currentConfig = $config;

  onMount(() => {
    initRouter();
  });
</script>

<div class="app-container">
  <TabNavigation />
  
  <main class="main-content">
    <div class="content">
      {#if $currentRoute === "overview"}
        <InfoTab />
      {:else if $currentRoute === "temporal"}
        <TemporalExplorerTab />
      {:else if $currentRoute === "slider"}
        <SliderTab />
      {:else if $currentRoute === "map"}
        <MapTab />
      {:else if $currentRoute === "profile"}
        <div class="placeholder">
          <h2>Profiles Section</h2>
          <p>Developer profiles will be displayed here.</p>
        </div>
      {:else}
        <InfoTab />
      {/if}
    </div>
  </main>
</div>

<style>
  .app-container {
    display: flex;
    min-height: 100vh;
    position: relative;
  }

  .main-content {
    margin-left: 280px;
    flex: 1;
    position: relative;
    min-height: 100vh;
  }

  .content {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 0.8rem;
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
  }

  .placeholder {
    padding: 2rem;
    text-align: center;
    color: rgba(255, 255, 255, 0.8);
  }

  .placeholder h2 {
    margin-bottom: 1rem;
    color: #667eea;
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

</style>