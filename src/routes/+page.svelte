<script>
	import TabNavigation from '../components/TabNavigation.svelte';
	import InfoTab from '../components/InfoTab.svelte';
	import SliderTab from '../components/SliderTab.svelte';
	import MapTab from '../components/MapTab.svelte';
	import { activeTab, config } from '../stores/appStore.js';
  
	$: currentConfig = $config;
  </script>
  
  <main>
	<div class="container">
	  <!-- Header -->
	  <header class="header">
		<h1>{currentConfig.paperTitle}</h1>
		<p>{currentConfig.paperSubtitle}</p>
	  </header>
  
	  <!-- Navigation -->
	  <TabNavigation />
  
	  <!-- Content -->
	  <div class="content">
		{#if $activeTab === 'info'}
		  <InfoTab />
		{:else if $activeTab === 'slider'}
		  <SliderTab />
		{:else if $activeTab === 'map'}
		  <MapTab />
		{/if}
	  </div>
	</div>
  </main>
  
  <style>
	:global(body) {
	  margin: 0;
	  padding: 0;
	  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	  min-height: 100vh;
	  font-family: 'Arial', sans-serif;
	}
  
	.container {
	  max-width: 1200px;
	  margin: 0 auto;
	  padding: 20px;
	}
  
	.header {
	  text-align: center;
	  color: white;
	  margin-bottom: 30px;
	}
  
	.header h1 {
	  font-size: 2.5rem;
	  margin-bottom: 10px;
	  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
	  margin: 0 0 10px 0;
	}
  
	.header p {
	  font-size: 1.2rem;
	  opacity: 0.9;
	  margin: 0;
	}
  
	.content {
	  background: rgba(255,255,255,0.95);
	  border-radius: 0 0 10px 10px;
	  padding: 30px;
	  min-height: 500px;
	  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
	  backdrop-filter: blur(10px);
	  animation: fadeIn 0.5s ease;
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
  
	/* Responsive Design */
	@media (max-width: 768px) {
	  .container {
		padding: 10px;
	  }
	  
	  .header h1 {
		font-size: 2rem;
	  }
	  
	  .header p {
		font-size: 1rem;
	  }
	  
	  .content {
		padding: 20px;
	  }
	}
  </style>