<script>
  import { currentImage, config } from '../stores/appStore.js';
  import { onMount } from 'svelte';

  let imageElement;
  let imageLoaded = false;
  let imageError = false;
  let mounted = false;

  $: currentConfig = $config;
  $: imagePath = `${currentConfig.imageBasePath}${currentConfig.imagePrefix}${$currentImage}${currentConfig.imageExtension}`;

  onMount(() => {
    mounted = true;
  });

  function handleSliderChange(event) {
    const newValue = parseInt(event.target.value);
    currentImage.set(newValue);
    imageLoaded = false;
    imageError = false;
  }

  function handleImageLoad() {
    imageLoaded = true;
    imageError = false;
  }

  function handleImageError() {
    imageLoaded = false;
    imageError = true;
  }

  function previousImage() {
    if ($currentImage > 0) {
      currentImage.set($currentImage - 1);
    }
  }

  function nextImage() {
    if ($currentImage < currentConfig.imageCount - 1) {
      currentImage.set($currentImage + 1);
    }
  }

  function jumpToImage(imageNumber) {
    if (imageNumber >= 0 && imageNumber < currentConfig.imageCount) {
      currentImage.set(imageNumber);
      imageLoaded = false;
      imageError = false;
    }
  }

  function handleManualInput(event) {
    const value = parseInt(event.target.value);
    if (!isNaN(value)) {
      jumpToImage(value);
    }
  }

  function handleInputKeydown(event) {
    if (event.key === 'Enter') {
      event.target.blur(); // Quitar focus del input
    }
  }

  // Atajos de teclado
  function handleKeydown(event) {
    switch(event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        previousImage();
        break;
      case 'ArrowRight':
        event.preventDefault();
        nextImage();
        break;
      case 'Home':
        event.preventDefault();
        jumpToImage(0);
        break;
      case 'End':
        event.preventDefault();
        jumpToImage(currentConfig.imageCount - 1);
        break;
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="slider-section" class:mounted>
  <h2>🖼️ Exploración Temporal</h2>
  <p class="description">
    Use el slider para navegar a través de las diferentes imágenes del dataset (0-{currentConfig.imageCount - 1}).
    También puede usar las flechas del teclado para navegar.
  </p>
  
  <div class="controls-section">
    <!-- Controles de navegación -->
    <div class="navigation-controls">
      <button 
        class="nav-button" 
        on:click={previousImage} 
        disabled={$currentImage === 0}
        title="Imagen anterior (←)"
      >
        ◀
      </button>
      
      <div class="image-counter">
        <input 
          type="number" 
          min="0" 
          max={currentConfig.imageCount - 1}
          value={$currentImage}
          class="current-number-input"
          on:input={handleManualInput}
          on:keydown={handleInputKeydown}
          title="Escriba el número de imagen"
        />
        <span class="separator">/</span>
        <span class="total-number">{currentConfig.imageCount - 1}</span>
      </div>
      
      <button 
        class="nav-button" 
        on:click={nextImage} 
        disabled={$currentImage === currentConfig.imageCount - 1}
        title="Imagen siguiente (→)"
      >
        ▶
      </button>
    </div>

    <!-- Slider principal -->
    <div class="slider-container">
      <input 
        type="range" 
        min="0" 
        max={currentConfig.imageCount - 1} 
        value={$currentImage}
        class="slider" 
        on:input={handleSliderChange}
        title="Deslice para cambiar de imagen"
      />
      
      <!-- Marcadores en el slider -->
      <div class="slider-markers">
        {#each Array(Math.min(10, currentConfig.imageCount)) as _, i}
          {@const markerValue = Math.floor((currentConfig.imageCount - 1) * i / 9)}
          <div 
            class="marker" 
            style="left: {(i / 9) * 100}%"
            class:active={Math.abs($currentImage - markerValue) < 5}
          >
            {markerValue}
          </div>
        {/each}
      </div>
    </div>

    <!-- Salto rápido -->
    <div class="quick-jump">
      <button class="jump-button" on:click={() => jumpToImage(0)}>Inicio</button>
      <button class="jump-button" on:click={() => jumpToImage(Math.floor(currentConfig.imageCount / 4))}>25%</button>
      <button class="jump-button" on:click={() => jumpToImage(Math.floor(currentConfig.imageCount / 2))}>50%</button>
      <button class="jump-button" on:click={() => jumpToImage(Math.floor(currentConfig.imageCount * 3 / 4))}>75%</button>
      <button class="jump-button" on:click={() => jumpToImage(currentConfig.imageCount - 1)}>Final</button>
    </div>
  </div>

  <!-- Contenedor de imagen -->
  <div class="image-container">
    {#if imageError}
      <div class="error-placeholder">
        <div class="error-icon">❌</div>
        <h3>Error al cargar imagen</h3>
        <p>No se pudo cargar: <code>{$currentImage}.jpg</code></p>
        <p class="error-details">
          Asegúrese de que las imágenes estén en la carpeta 
          <code>/public/assets/images/</code> con el formato: <code>0.jpg, 1.jpg, 2.jpg...</code>
        </p>
        <button class="retry-button" on:click={() => {imageError = false; imageLoaded = false;}}>
          🔄 Reintentar
        </button>
      </div>
    {:else if !imageLoaded}
      <div class="loading-placeholder">
        <div class="loading-spinner"></div>
        <h3>Cargando imagen #{$currentImage}</h3>
        <!-- Removido: <p>Ruta: <code>{imagePath}</code></p> -->
      </div>
    {/if}

    <!-- Imagen real (oculta hasta que cargue) -->
    <img 
      bind:this={imageElement}
      src={imagePath}
      alt="Imagen {$currentImage}"
      class="main-image"
      class:loaded={imageLoaded}
      on:load={handleImageLoad}
      on:error={handleImageError}
    />
    
    {#if imageLoaded}
      <div class="image-info">
        <span class="image-title">Imagen #{$currentImage}</span>
        <!-- Removido: <span class="image-path">{imagePath}</span> -->
      </div>
    {/if}
  </div>

  <!-- Información adicional -->
  <div class="info-panel">
    <h3>ℹ️ Información de Navegación</h3>
    <div class="info-grid">
      <div class="info-item">
        <strong>Atajos de teclado:</strong>
        <ul>
          <li>← → Navegar imágenes</li>
          <li>Home/End Ir al inicio/final</li>
        </ul>
      </div>
      <div class="info-item">
        <strong>Imagen actual:</strong>
        <ul>
          <li>Número: {$currentImage}</li>
          <li>Progreso: {Math.round(($currentImage / (currentConfig.imageCount - 1)) * 100)}%</li>
        </ul>
      </div>
    </div>
  </div>
</div>

<style>
  .slider-section {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s ease;
  }

  .slider-section.mounted {
    opacity: 1;
    transform: translateY(0);
  }

  .slider-section h2 {
    color: #667eea;
    margin-bottom: 20px;
    font-size: 2rem;
    background: linear-gradient(135deg, #667eea, #764ba2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .description {
    margin-bottom: 30px;
    color: #666;
    font-size: 1.1rem;
    text-align: center;
    line-height: 1.6;
  }

  .controls-section {
    background: rgba(102, 126, 234, 0.05);
    padding: 25px;
    border-radius: 12px;
    margin-bottom: 30px;
    border: 1px solid rgba(102, 126, 234, 0.1);
  }

  .navigation-controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    margin-bottom: 20px;
  }

  .nav-button {
    background: linear-gradient(135deg, #667eea, #764ba2);
    border: none;
    color: white;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    font-size: 1.2rem;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  }

  .nav-button:hover:not(:disabled) {
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  }

  .nav-button:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    transform: none;
  }

  .image-counter {
    background: white;
    padding: 10px 20px;
    border-radius: 25px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    font-family: 'Courier New', monospace;
    font-size: 1.2rem;
    min-width: 100px;
    text-align: center;
  }

  .current-number-input {
    font-weight: bold;
    color: #667eea;
    font-size: 1.4rem;
    background: transparent;
    border: none;
    outline: none;
    text-align: center;
    width: 60px;
    font-family: 'Courier New', monospace;
    transition: all 0.3s ease;
  }

  .current-number-input:focus {
    background: rgba(102, 126, 234, 0.1);
    border-radius: 4px;
    color: #5a67d8;
  }

  .current-number-input::-webkit-outer-spin-button,
  .current-number-input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  .current-number-input[type=number] {
    -moz-appearance: textfield;
  }

  .separator {
    margin: 0 8px;
    color: #999;
  }

  .total-number {
    color: #666;
  }

  .slider-container {
    position: relative;
    margin: 20px 0;
  }

  .slider {
    width: 100%;
    height: 8px;
    border-radius: 5px;
    background: linear-gradient(90deg, #667eea, #764ba2);
    outline: none;
    -webkit-appearance: none;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .slider:hover {
    height: 10px;
  }

  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: #fff;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    transition: all 0.3s ease;
    border: 3px solid #667eea;
  }

  .slider::-webkit-slider-thumb:hover {
    transform: scale(1.3);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
  }

  .slider::-moz-range-thumb {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: #fff;
    cursor: pointer;
    border: 3px solid #667eea;
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
  }

  .slider-markers {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    position: relative;
    height: 20px;
  }

  .marker {
    position: absolute;
    transform: translateX(-50%);
    font-size: 0.75rem;
    color: #999;
    transition: all 0.3s ease;
  }

  .marker.active {
    color: #667eea;
    font-weight: bold;
    transform: translateX(-50%) scale(1.2);
  }

  .quick-jump {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 15px;
    flex-wrap: wrap;
  }

  .jump-button {
    background: rgba(102, 126, 234, 0.1);
    border: 1px solid rgba(102, 126, 234, 0.3);
    color: #667eea;
    padding: 8px 16px;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.9rem;
  }

  .jump-button:hover {
    background: rgba(102, 126, 234, 0.2);
    transform: translateY(-2px);
  }

  .image-container {
    position: relative;
    margin-top: 30px;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    background: #f8f9fa;
    min-height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .main-image {
    max-width: 100%;
    max-height: 500px;
    width: auto;
    height: auto;
    border-radius: 8px;
    opacity: 0;
    transition: opacity 0.5s ease;
    object-fit: contain;
  }

  .main-image.loaded {
    opacity: 1;
  }

  .loading-placeholder, .error-placeholder {
    text-align: center;
    padding: 40px;
    color: #666;
  }

  .loading-spinner {
    width: 50px;
    height: 50px;
    border: 4px solid rgba(102, 126, 234, 0.2);
    border-left: 4px solid #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 20px;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .error-icon {
    font-size: 3rem;
    margin-bottom: 15px;
  }

  .error-placeholder h3, .loading-placeholder h3 {
    color: #333;
    margin-bottom: 10px;
  }

  .error-placeholder code {
    background: rgba(102, 126, 234, 0.1);
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'Courier New', monospace;
  }

  .error-details {
    font-size: 0.9rem;
    margin-top: 15px;
    line-height: 1.4;
  }

  .retry-button {
    background: #667eea;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
    margin-top: 15px;
    transition: all 0.3s ease;
  }

  .retry-button:hover {
    background: #5a67d8;
    transform: translateY(-2px);
  }

  .image-info {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(transparent, rgba(0,0,0,0.7));
    color: white;
    padding: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .image-title {
    font-weight: bold;
    font-size: 1.1rem;
  }

  .info-panel {
    margin-top: 30px;
    background: rgba(118, 75, 162, 0.05);
    padding: 20px;
    border-radius: 12px;
    border: 1px solid rgba(118, 75, 162, 0.1);
  }

  .info-panel h3 {
    color: #764ba2;
    margin-bottom: 15px;
    font-size: 1.2rem;
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
  }

  .info-item ul {
    margin: 5px 0 0 0;
    padding-left: 20px;
  }

  .info-item li {
    margin: 3px 0;
    font-size: 0.95rem;
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .navigation-controls {
      flex-direction: column;
      gap: 15px;
    }

    .quick-jump {
      justify-content: center;
    }

    .jump-button {
      font-size: 0.8rem;
      padding: 6px 12px;
    }

    .image-info {
      flex-direction: column;
      text-align: center;
      gap: 5px;
    }

    .slider-section h2 {
      font-size: 1.6rem;
    }

    .info-grid {
      grid-template-columns: 1fr;
    }
  }
</style>