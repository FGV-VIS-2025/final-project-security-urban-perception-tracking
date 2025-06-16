<script>
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import Icon from "../lib/Icon.svelte";
  import { onMount } from 'svelte';

  const navSections = [
    {
      title: "Main",
      items: [
        { id: "overview", label: "Overview", icon: "home" }, // Cambiado de "" a "overview"
        { id: "temporal", label: "Eye Tracking Vis", icon: "eye" },
        { id: "map", label: "Interactive Map", icon: "map", badge: "" },
      ],
    },
    {
      title: "Developers", 
      items: [{ id: "profiles", label: "Profiles", icon: "develop" }],
    },
  ];

  let sidebarOpen = false;
  let isNavigating = false;

  function getCurrentRoute(pathname) {
    const cleanPath = pathname.replace(base, '').replace(/^\/+/, '').replace(/\/+$/, '');
    return cleanPath || 'overview'; // Si está vacío, es overview
  }

  $: currentRoute = getCurrentRoute($page.url.pathname);

  onMount(() => {
    const currentPath = $page.url.pathname;
    if (currentPath === '/' || currentPath === base + '/' || currentPath === base) {
      console.log('Redirecting from root to /overview');
      goto('/overview', { replaceState: true });
    }
  });

  async function selectTab(tabId) {
    if (isNavigating) {
      console.log('Navigation already in progress, skipping...');
      return;
    }

    try {
      isNavigating = true;
      
      const targetRoute = `/${tabId}`;
      
      console.log('Navigating to:', targetRoute);
      console.log('Current route:', currentRoute, 'Target ID:', tabId);
      
      if (window.innerWidth <= 768) {
        sidebarOpen = false;
      }
      
      if (currentRoute === tabId) {
        console.log('Already on target route, skipping navigation');
        return;
      }
      
      await goto(targetRoute);
      
      console.log('Navigation completed successfully');
      
    } catch (error) {
      console.error('Navigation error:', error);
    } finally {
      setTimeout(() => {
        isNavigating = false;
      }, 100);
    }
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

  // Debug
  $: {
    console.log('=== DEBUG INFO ===');
    console.log('Page pathname:', $page.url.pathname);
    console.log('Current route:', currentRoute);
    console.log('==================');
  }
</script>

<svelte:window on:click={handleOutsideClick} />

<button class="sidebar-toggle" on:click={toggleSidebar}>
  <span class="toggle-icon">⚡</span>
</button>

<aside class="sidebar" class:open={sidebarOpen} id="sidebar">
  <div class="sidebar-grid"></div>
  <div class="sidebar-scanner"></div>
  
  <div class="sidebar-header">
    <div class="logo-container">
      <div class="logo-icon">◉</div>
      <div class="logo-text">
        <div class="logo">SUPT</div>
        <div class="logo-subtitle">Security Urban Perception Tracking</div>
      </div>
    </div>
  </div>

  <nav class="nav-container">
    {#each navSections as section, sectionIndex}
      <div class="nav-section">
        <div class="section-header">
          <div class="section-number">0{sectionIndex + 1}</div>
          <div class="section-title">{section.title}</div>
          <div class="section-line"></div>
        </div>
        
        <div class="nav-items">
          {#each section.items as item}
            <div 
              class="nav-item" 
              class:active={currentRoute === item.id}
              class:navigating={isNavigating}
              on:click={() => selectTab(item.id)}
              on:keydown={(e) => e.key === "Enter" && selectTab(item.id)}
              role="button"
              tabindex="0"
              style="pointer-events: {isNavigating ? 'none' : 'auto'}"
            >
              <div class="nav-item-glow"></div>
              <div class="nav-content">
                <div class="nav-icon-wrapper">
                  <div class="nav-icon">
                    <Icon 
                      name={item.icon} 
                      size={20} 
                      color={currentRoute === item.id ? "#f8fafc" : "#94a3b8"}
                      strokeWidth={currentRoute === item.id ? 2.2 : 1.8}
                    />
                  </div>
                </div>
                <div class="nav-text">
                  <div class="nav-label">{item.label}</div>
                  {#if item.badge}
                    <div class="nav-badge">
                      <span class="badge-text">{item.badge}</span>
                    </div>
                  {/if}
                </div>
              </div>
              <div class="nav-arrow">→</div>
            </div>
          {/each}
        </div>
      </div>
    {/each}
  </nav>

  <div class="sidebar-footer">
    <div class="footer-stats">
      <div class="stat-item">
        <div class="stat-value">Rio de Janeiro</div>
        <div class="stat-label">LOCATION</div>
      </div>
    </div>
  </div>
</aside>

<style>
  :global(*) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :global(body) {
    background: 
      radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.06) 0%, transparent 50%),
      linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
    color: #f8fafc;
    overflow-x: hidden;
  }

  .sidebar {
    width: 320px;
    background: 
      linear-gradient(135deg, 
        rgba(15, 23, 42, 0.95) 0%, 
        rgba(30, 41, 59, 0.92) 50%,
        rgba(51, 65, 85, 0.90) 100%
      );
    backdrop-filter: blur(24px) saturate(180%);
    border-right: 1px solid rgba(148, 163, 184, 0.1);
    position: fixed;
    height: 100vh;
    left: 0;
    top: 0;
    z-index: 1000;
    overflow: hidden;
    transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    display: flex;
    flex-direction: column;
    box-shadow: 
      24px 0 48px -12px rgba(0, 0, 0, 0.25),
      0 0 0 1px rgba(255, 255, 255, 0.05);
  }

  .sidebar-grid {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      linear-gradient(rgba(148, 163, 184, 0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(148, 163, 184, 0.02) 1px, transparent 1px);
    background-size: 32px 32px;
    opacity: 0.6;
    pointer-events: none;
  }

  .sidebar-scanner {
    position: absolute;
    top: -20px;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.6), transparent);
    animation: scan-line 8s ease-in-out infinite;
    pointer-events: none;
  }

  .sidebar-header {
    padding: 2rem 1.75rem 1.5rem;
    border-bottom: 1px solid rgba(148, 163, 184, 0.08);
    flex-shrink: 0;
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.04), rgba(168, 85, 247, 0.02));
  }

  .logo-container {
    display: flex;
    align-items: center;
    gap: 0.875rem;
    margin-bottom: 0.75rem;
  }

  .logo-icon {
    width: 44px;
    height: 44px;
    background: 
      linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(168, 85, 247, 0.08));
    border: 1px solid rgba(99, 102, 241, 0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    color: #a5b4fc;
    animation: pulse-icon 4s ease-in-out infinite;
    box-shadow: 0 0 24px rgba(99, 102, 241, 0.1);
  }

  .logo-text {
    flex: 1;
  }

  .logo {
    font-size: 1.75rem;
    font-weight: 800;
    background: linear-gradient(
      135deg, 
      #f8fafc 0%, 
      #a5b4fc 30%, 
      #e2e8f0 70%
    );
    background-size: 200% 200%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 6s ease-in-out infinite;
    line-height: 1;
    margin-bottom: 0.25rem;
    letter-spacing: -0.025em;
  }

  .logo-subtitle {
    font-size: 0.6rem;
    color: rgba(148, 163, 184, 0.8);
    text-transform: uppercase;
    letter-spacing: 1.2px;
    font-weight: 500;
  }

  .nav-container {
    flex: 1;
    padding: 1.25rem 0;
    overflow-y: auto;
  }

  .nav-section {
    margin-bottom: 2rem;
  }

  .section-header {
    display: flex;
    align-items: center;
    padding: 0 1.75rem 0.875rem;
    gap: 0.875rem;
  }

  .section-number {
    font-size: 1rem;
    font-weight: 700;
    color: rgba(99, 102, 241, 0.7);
    width: 24px;
    font-family: 'JetBrains Mono', monospace;
  }

  .section-title {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: rgba(148, 163, 184, 0.9);
    font-weight: 600;
  }

  .section-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, rgba(99, 102, 241, 0.2), transparent);
  }

  .nav-items {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }

  .nav-item {
    position: relative;
    margin: 0 1.25rem;
    padding: 0.875rem 1.25rem;
    cursor: pointer;
    border-radius: 12px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
    background: rgba(15, 23, 42, 0.3);
    border: 1px solid rgba(148, 163, 184, 0.06);
  }

  .nav-item-glow {
    position: absolute;
    top: 0;
    left: -100%;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.04), transparent);
    transition: left 0.6s ease;
    pointer-events: none;
  }

  .nav-item:hover .nav-item-glow {
    left: 100%;
  }

  .nav-item:hover {
    background: rgba(99, 102, 241, 0.06);
    border-color: rgba(99, 102, 241, 0.15);
    transform: translateX(4px);
    box-shadow: 0 4px 20px rgba(99, 102, 241, 0.08);
  }

  .nav-item.active {
    background: 
      linear-gradient(135deg, 
        rgba(99, 102, 241, 0.1) 0%, 
        rgba(168, 85, 247, 0.06) 100%
      );
    border-color: rgba(99, 102, 241, 0.25);
    transform: translateX(6px);
    box-shadow: 
      0 6px 24px rgba(99, 102, 241, 0.12),
      0 0 0 1px rgba(99, 102, 241, 0.1);
  }

  .nav-content {
    display: flex;
    align-items: center;
    gap: 0.875rem;
    position: relative;
    z-index: 2;
  }

  .nav-icon-wrapper {
    width: 36px;
    height: 36px;
    background: rgba(148, 163, 184, 0.06);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(148, 163, 184, 0.08);
    transition: all 0.3s ease;
  }

  .nav-item.active .nav-icon-wrapper {
    background: rgba(99, 102, 241, 0.12);
    border-color: rgba(99, 102, 241, 0.2);
    box-shadow: 0 0 16px rgba(99, 102, 241, 0.1);
  }

  .nav-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .nav-label {
    font-weight: 500;
    color: rgba(148, 163, 184, 0.95);
    font-size: 0.875rem;
    line-height: 1.25;
  }

  .nav-item.active .nav-label {
    color: #f8fafc;
    font-weight: 600;
  }

  .nav-badge {
    background: rgba(15, 23, 42, 0.8);
    border: 1px solid rgba(99, 102, 241, 0.2);
    border-radius: 6px;
    padding: 0.125rem 0.5rem;
    display: inline-block;
    width: fit-content;
    backdrop-filter: blur(12px);
  }

  .badge-text {
    font-size: 0.625rem;
    color: #a5b4fc;
    font-weight: 600;
    font-family: 'JetBrains Mono', monospace;
  }

  .nav-arrow {
    color: rgba(148, 163, 184, 0.3);
    font-size: 1rem;
    transition: all 0.3s ease;
    transform: translateX(-4px);
    opacity: 0;
  }

  .nav-item:hover .nav-arrow {
    transform: translateX(0);
    opacity: 1;
    color: rgba(99, 102, 241, 0.8);
  }

  .sidebar-footer {
    padding: 1.25rem 1.75rem;
    border-top: 1px solid rgba(148, 163, 184, 0.08);
    flex-shrink: 0;
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.02), rgba(168, 85, 247, 0.01));
  }

  .footer-stats {
    background: rgba(15, 23, 42, 0.4);
    border-radius: 8px;
    padding: 0.875rem;
    border: 1px solid rgba(148, 163, 184, 0.06);
    backdrop-filter: blur(12px);
  }

  .stat-item {
    text-align: center;
  }

  .stat-value {
    font-size: 0.8rem;
    font-weight: 600;
    color: #a5b4fc;
    margin-bottom: 0.125rem;
  }

  .stat-label {
    font-size: 0.6rem;
    color: rgba(148, 163, 184, 0.6);
    letter-spacing: 1px;
    font-weight: 500;
  }

  .sidebar-toggle {
    display: none;
    position: fixed;
    top: 1.5rem;
    left: 1.5rem;  
    z-index: 1001;
    width: 48px;
    height: 48px;
    background: 
      linear-gradient(135deg, 
        rgba(15, 23, 42, 0.95), 
        rgba(30, 41, 59, 0.9)
      );
    backdrop-filter: blur(20px);
    border: 1px solid rgba(99, 102, 241, 0.2);
    border-radius: 50%;
    color: #a5b4fc;
    cursor: pointer;
    font-size: 1.1rem;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }

  .toggle-icon {
    animation: pulse-icon 4s ease-in-out infinite;
  }

  .sidebar-toggle:hover {
    background: 
      linear-gradient(135deg, 
        rgba(99, 102, 241, 0.15), 
        rgba(30, 41, 59, 0.95)
      );
    transform: scale(1.05);
    box-shadow: 0 6px 24px rgba(99, 102, 241, 0.15);
    border-color: rgba(99, 102, 241, 0.3);
  }

  @keyframes shimmer {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }

  @keyframes pulse-icon {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.05); }
  }

  @keyframes scan-line {
    0% { transform: translateY(0); opacity: 1; }
    50% { opacity: 0.6; }
    100% { transform: translateY(100vh); opacity: 0; }
  }

  .nav-container::-webkit-scrollbar {
    width: 3px;
  }

  .nav-container::-webkit-scrollbar-track {
    background: rgba(148, 163, 184, 0.05);
  }

  .nav-container::-webkit-scrollbar-thumb {
    background: rgba(99, 102, 241, 0.3);
    border-radius: 2px;
  }

  .nav-container::-webkit-scrollbar-thumb:hover {
    background: rgba(99, 102, 241, 0.5);
  }
</style>