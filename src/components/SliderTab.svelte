<script>
  import { currentImage, config } from "../stores/appStore.js";
  import { onMount } from "svelte";

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
    if ($currentImage > 1) {
      currentImage.set($currentImage - 1);
    }
  }

  function nextImage() {
    if ($currentImage < currentConfig.imageCount) {
      currentImage.set($currentImage + 1);
    }
  }

  function jumpToImage(imageNumber) {
    if (imageNumber >= 1 && imageNumber <= currentConfig.imageCount) {
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
    if (event.key === "Enter") {
      event.target.blur(); // Quitar focus del input
    }
  }

  function handleKeydown(event) {
    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();
        previousImage();
        break;
      case "ArrowRight":
        event.preventDefault();
        nextImage();
        break;
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="slider-section" class:mounted>
  <h2>🖼️ Time Browsing</h2>
  <p class="description">
    Navigate through images (1-{currentConfig.imageCount}) using controls or arrow keys.
  </p>

  <div class="controls-section">
    <!-- Navigation controls -->
    <div class="navigation-controls">
      <button
        class="nav-button"
        on:click={previousImage}
        disabled={$currentImage === 1}
        title="Previous image (←)"
      >
        ◀
      </button>

      <div class="image-counter">
        <input
          type="number"
          min="1"
          max={currentConfig.imageCount}
          value={$currentImage}
          class="current-number-input"
          on:input={handleManualInput}
          on:keydown={handleInputKeydown}
          title="Enter image number"
        />
        <span class="separator">/</span>
        <span class="total-number">{currentConfig.imageCount}</span>
      </div>

      <button
        class="nav-button"
        on:click={nextImage}
        disabled={$currentImage === currentConfig.imageCount}
        title="Next image (→)"
      >
        ▶
      </button>
    </div>

    <div class="slider-container">
      <input
        type="range"
        min="1"
        max={currentConfig.imageCount}
        value={$currentImage}
        class="slider"
        on:input={handleSliderChange}
        title="Slide to change image"
      />

      <div class="slider-markers">
        {#each Array(Math.min(6, currentConfig.imageCount)) as _, i}
          {@const markerValue = Math.floor(
            1 + ((currentConfig.imageCount - 1) * i) / Math.min(5, currentConfig.imageCount - 1)
          )}
          <div
            class="marker"
            style="left: {(i / Math.min(5, currentConfig.imageCount - 1)) * 100}%"
            class:active={Math.abs($currentImage - markerValue) < 5}
          >
            {markerValue}
          </div>
        {/each}
      </div>
    </div>
  </div>

  <div class="image-container">
    {#if imageError}
      <div class="error-placeholder">
        <div class="error-icon">❌</div>
        <h4>Error loading image</h4>
        <p class="error-text">Could not load: <code>{$currentImage}.jpg</code></p>
        <button
          class="retry-button"
          on:click={() => {
            imageError = false;
            imageLoaded = false;
          }}
        >
          🔄 Retry
        </button>
      </div>
    {:else if !imageLoaded}
      <div class="loading-placeholder">
        <div class="loading-spinner"></div>
        <h4>Loading #{$currentImage}</h4>
      </div>
    {/if}

    <img
      bind:this={imageElement}
      src={imagePath}
      alt="Image {$currentImage}"
      class="main-image"
      class:loaded={imageLoaded}
      on:load={handleImageLoad}
      on:error={handleImageError}
    />
  </div>
</div>

<style>
  .slider-section {
    height: 100%;
    display: flex;
    flex-direction: column;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.6s ease;
    overflow: hidden;
  }

  .slider-section.mounted {
    opacity: 1;
    transform: translateY(0);
  }

  .slider-section h2 {
    color: #ffffff;
    margin: 0 0 0.8rem 0;
    font-size: 1.3rem;
    font-weight: 600;
    background: linear-gradient(135deg, #667eea, #764ba2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .description {
    margin: 0 0 1rem 0;
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.85rem;
    line-height: 1.4;
    flex-shrink: 0;
  }

  .controls-section {
    background: rgba(255, 255, 255, 0.03);
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    border: 1px solid rgba(255, 255, 255, 0.05);
    flex-shrink: 0;
  }

  .navigation-controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.8rem;
    margin-bottom: 1rem;
  }

  .nav-button {
    background: linear-gradient(135deg, #667eea, #764ba2);
    border: none;
    color: white;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
    flex-shrink: 0;
  }

  .nav-button:hover:not(:disabled) {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  .nav-button:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    transform: none;
  }

  .image-counter {
    background: rgba(255, 255, 255, 0.9);
    padding: 0.5rem 1rem;
    border-radius: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    font-family: "Courier New", monospace;
    font-size: 1rem;
    min-width: 80px;
    text-align: center;
    flex-shrink: 0;
  }

  .current-number-input {
    font-weight: bold;
    color: #667eea;
    font-size: 1.1rem;
    background: transparent;
    border: none;
    outline: none;
    text-align: center;
    width: 45px;
    font-family: "Courier New", monospace;
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

  .current-number-input[type="number"] {
    -moz-appearance: textfield;
  }

  .separator {
    margin: 0 6px;
    color: #999;
  }

  .total-number {
    color: #666;
  }

  .slider-container {
    position: relative;
    margin: 0;
  }

  .slider {
    width: 100%;
    height: 6px;
    border-radius: 3px;
    background: linear-gradient(90deg, #667eea, #764ba2);
    outline: none;
    -webkit-appearance: none;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .slider:hover {
    height: 8px;
  }

  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #fff;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease;
    border: 2px solid #667eea;
  }

  .slider::-webkit-slider-thumb:hover {
    transform: scale(1.2);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.5);
  }

  .slider::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #fff;
    cursor: pointer;
    border: 2px solid #667eea;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  .slider-markers {
    display: flex;
    justify-content: space-between;
    margin-top: 0.5rem;
    position: relative;
    height: 15px;
  }

  .marker {
    position: absolute;
    transform: translateX(-50%);
    font-size: 0.65rem;
    color: rgba(255, 255, 255, 0.5);
    transition: all 0.3s ease;
  }

  .marker.active {
    color: #667eea;
    font-weight: bold;
    transform: translateX(-50%) scale(1.1);
  }

  .image-container {
    position: relative;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
    background: rgba(255, 255, 255, 0.02);
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 200px;
    max-height: 300px;
  }

  .main-image {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
    border-radius: 6px;
    opacity: 0;
    transition: opacity 0.4s ease;
    object-fit: contain;
  }

  .main-image.loaded {
    opacity: 1;
  }

  .loading-placeholder,
  .error-placeholder {
    text-align: center;
    padding: 2rem 1rem;
    color: rgba(255, 255, 255, 0.7);
  }

  .loading-spinner {
    width: 35px;
    height: 35px;
    border: 3px solid rgba(102, 126, 234, 0.2);
    border-left: 3px solid #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .error-icon {
    font-size: 2rem;
    margin-bottom: 0.8rem;
  }

  .error-placeholder h4,
  .loading-placeholder h4 {
    color: rgba(255, 255, 255, 0.9);
    margin: 0 0 0.5rem 0;
    font-size: 1rem;
    font-weight: 600;
  }

  .error-text {
    font-size: 0.8rem;
    margin: 0.5rem 0 1rem 0;
    line-height: 1.3;
  }

  .error-placeholder code {
    background: rgba(102, 126, 234, 0.15);
    padding: 2px 4px;
    border-radius: 3px;
    font-family: "Courier New", monospace;
    color: #667eea;
  }

  .retry-button {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.85rem;
  }

  .retry-button:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }

  @media (max-width: 1400px) {
    .navigation-controls {
      gap: 0.6rem;
    }
    
    .nav-button {
      width: 32px;
      height: 32px;
      font-size: 0.8rem;
    }
    
    .image-counter {
      padding: 0.4rem 0.8rem;
      font-size: 0.9rem;
    }
    
    .current-number-input {
      width: 40px;
      font-size: 1rem;
    }
  }

  @media (max-width: 1200px) {
    .slider-section h2 {
      font-size: 1.2rem;
    }
    
    .description {
      font-size: 0.8rem;
    }
    
    .controls-section {
      padding: 0.8rem;
    }
    
    .image-container {
      min-height: 180px;
      max-height: 250px;
    }
  }
</style>