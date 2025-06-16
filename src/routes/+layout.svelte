<script>
  import TabNavigation from "../components/TabNavigation.svelte";
</script>

<div class="app-container">
  <TabNavigation />
  <main class="main-content">
    <div class="content">
      <slot />
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
    margin-left: 320px;
    flex: 1;
    position: relative;
    min-height: 100vh;
  }

  .content {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 0.5rem;
    min-height: 100vh;
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
