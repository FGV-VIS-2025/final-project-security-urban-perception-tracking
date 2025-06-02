<script>
  import { activeTab } from "../stores/appStore.js";
  const navSections = [
    {
      title: "Main",
      items: [
        { id: "info", label: "Dashboard", icon: "🏠" },
        { id: "map", label: "Interactive Map", icon: "🗺️", badge: "148" },
      ],
    },
    {
      title: "Developers",
      items: [{ id: "profile", label: "Profiles", icon: "⚙️" }],
    },
  ];

  let sidebarOpen = false;

  function selectTab(tabId) {
    activeTab.set(tabId);
  }

  function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
  }

  function handleOutsideClick(event) {
    if (window.innerWidth <= 768 && sidebarOpen) {
      const sidebar = document.getElementById("sidebar");
      const toggle = document.querySelector(".sidebar-toggle");

      if (!sidebar?.contains(event.target) && !toggle?.contains(event.target)) {
        sidebarOpen = false;
      }
    }
  }
</script>

<svelte:window on:click={handleOutsideClick} />
<button class="sidebar-toggle" on:click={toggleSidebar}>☰</button>

<aside class="sidebar" class:open={sidebarOpen} id="sidebar">
  <div class="sidebar-header">
    <div class="logo">SUPT</div>
    <div class="logo-subtitle">Security Urban Perception</div>
  </div>

  <nav>
    {#each navSections as section}
      <div class="nav-section">
        <div class="nav-title">{section.title}</div>
        {#each section.items as item}
          <div
            class="nav-item"
            class:active={$activeTab === item.id}
            on:click={() => selectTab(item.id)}
            on:keydown={(e) => e.key === "Enter" && selectTab(item.id)}
            role="button"
            tabindex="0"
          >
            <div class="nav-icon">{item.icon}</div>
            <div class="nav-label">{item.label}</div>
            {#if item.badge}
              <div class="nav-badge">{item.badge}</div>
            {/if}
          </div>
        {/each}
      </div>
    {/each}
  </nav>
</aside>

<style>
  :global(*) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :global(body) {
    font-family:
      "Inter",
      -apple-system,
      BlinkMacSystemFont,
      sans-serif;
    background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
    color: #ffffff;
    overflow-x: hidden;
  }

  .sidebar {
    width: 280px;
    background: rgba(15, 15, 35, 0.8);
    backdrop-filter: blur(20px);
    border-right: 1px solid rgba(255, 255, 255, 0.1);
    padding: 2rem 0;
    position: fixed;
    height: 100vh;
    left: 0;
    top: 0;
    z-index: 1000;
    overflow-y: auto;
    transition: transform 0.3s ease;
  }

  .sidebar-header {
    padding: 0 2rem 2rem;
  }

  .logo {
    font-size: 1.8rem;
    font-weight: 800;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 0.5rem;
  }

  .logo-subtitle {
    font-size: 0.75rem;
    opacity: 0.6;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .nav-section {
    margin-bottom: 2rem;
  }

  .nav-title {
    padding: 0 2rem 1rem;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    opacity: 0.5;
    font-weight: 600;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 2rem;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    border-left: 3px solid transparent;
  }

  .nav-item:hover {
    background: rgba(102, 126, 234, 0.1);
    border-left-color: rgba(102, 126, 234, 0.5);
  }

  .nav-item.active {
    background: rgba(102, 126, 234, 0.2);
    border-left-color: #667eea;
  }

  .nav-icon {
    font-size: 1.2rem;
    width: 24px;
    text-align: center;
  }

  .nav-label {
    font-weight: 500;
    flex: 1;
  }

  .nav-badge {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    font-size: 0.7rem;
    padding: 0.2rem 0.6rem;
    border-radius: 10px;
    font-weight: 600;
  }

  .sidebar-toggle {
    display: none;
    position: fixed;
    top: 1rem;
    left: 1rem;
    z-index: 1001;
    background: rgba(102, 126, 234, 0.2);
    border: 1px solid rgba(102, 126, 234, 0.3);
    border-radius: 8px;
    color: white;
    padding: 0.5rem;
    cursor: pointer;
    font-size: 1.2rem;
    transition: all 0.3s ease;
  }

  .sidebar-toggle:hover {
    background: rgba(102, 126, 234, 0.4);
  }

  /* Responsive */
  @media (max-width: 768px) {
    .sidebar {
      transform: translateX(-100%);
    }

    .sidebar.open {
      transform: translateX(0);
    }

    .sidebar-toggle {
      display: block;
    }
  }
</style>
