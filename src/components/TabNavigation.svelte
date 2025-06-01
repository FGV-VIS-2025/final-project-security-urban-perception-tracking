<script>
  import { activeTab } from '../stores/appStore.js';

  const tabs = [
    { id: 'info', label: 'Información', icon: '📊' },
    { id: 'slider', label: 'Visualización por Slider', icon: '🖼️' },
    { id: 'map', label: 'Mapa de Río de Janeiro', icon: '🗺️' }
  ];

  function selectTab(tabId) {
    activeTab.set(tabId);
  }
</script>

<nav class="tabs">
  {#each tabs as tab}
    <button 
      class="tab" 
      class:active={$activeTab === tab.id}
      on:click={() => selectTab(tab.id)}
    >
      <span class="tab-icon">{tab.icon}</span>
      <span class="tab-label">{tab.label}</span>
    </button>
  {/each}
</nav>

<style>
  .tabs {
    display: flex;
    background: rgba(255,255,255,0.1);
    border-radius: 10px 10px 0 0;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.2);
    overflow: hidden;
  }

  .tab {
    flex: 1;
    padding: 15px 20px;
    background: none;
    border: none;
    color: white;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    position: relative;
    overflow: hidden;
  }

  .tab::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
    transition: left 0.5s ease;
  }

  .tab:hover::before {
    left: 100%;
  }

  .tab:hover {
    background: rgba(255,255,255,0.1);
    transform: translateY(-2px);
  }

  .tab.active {
    background: rgba(255,255,255,0.2);
    box-shadow: inset 0 -3px 0 #fff;
    transform: translateY(-2px);
  }

  .tab-icon {
    font-size: 1.5rem;
    margin-bottom: 2px;
  }

  .tab-label {
    font-size: 0.9rem;
    font-weight: 500;
    text-align: center;
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .tabs {
      flex-direction: column;
      border-radius: 10px;
      margin-bottom: 10px;
    }

    .tab {
      flex-direction: row;
      justify-content: flex-start;
      padding: 12px 16px;
      text-align: left;
    }

    .tab-icon {
      margin-right: 10px;
      margin-bottom: 0;
    }

    .tab-label {
      font-size: 1rem;
    }

    .tab.active {
      box-shadow: inset 3px 0 0 #fff;
    }
  }

  @media (max-width: 480px) {
    .tab-label {
      font-size: 0.8rem;
    }
    
    .tab-icon {
      font-size: 1.2rem;
    }
  }
</style>