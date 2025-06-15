    <script>
  import { currentImage, config } from "../stores/appStore.js";
  import { onMount } from "svelte";
  import { base } from "$app/paths";
  import EyeTrackingVisualization from "./EyeTrackingVisualization.svelte";
  import FixationVisualization from "./FixationVisualization.svelte"; 

  let imageElement;
  let imageLoaded = false;
  let imageError = false;
  let mounted = false;
  let showEyeTracking = false;
  let showFixations = false;

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
      event.target.blur();
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

  function jumpToStart() {
    jumpToImage(1);
  }

  function jumpToEnd() {
    jumpToImage(currentConfig.imageCount);
  }

  function jumpToQuarter() {
    jumpToImage(Math.floor(currentConfig.imageCount / 4));
  }

  function jumpToMiddle() {
    jumpToImage(Math.floor(currentConfig.imageCount / 2));
  }

  function jumpToThreeQuarters() {
    jumpToImage(Math.floor((currentConfig.imageCount * 3) / 4));
  }

  function toggleEyeTracking() {
    showEyeTracking = !showEyeTracking;
    if (showEyeTracking) {
      showFixations = false; // Solo uno activo a la vez
    }
  }

  function toggleFixations() {
    showFixations = !showFixations;
    if (showFixations) {
      showEyeTracking = false; // Solo uno activo a la vez
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="temporal-explorer" class:mounted>
  <!-- Header Section -->
  <div class="header-section">
    <div class="title-container">
      <h1>⏱️ Eye Tracking Visualization</h1>
      <p class="subtitle">Navigate through images (1-{currentConfig.imageCount}) using controls or arrow keys.</p>
    </div>
    
    <div class="quick-stats">
      <div class="stat-item">
        <div class="stat-number">{$currentImage}</div>
        <div class="stat-label">Current</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">{currentConfig.imageCount}</div>
        <div class="stat-label">Total</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">{Math.round(($currentImage / currentConfig.imageCount) * 100)}%</div>
        <div class="stat-label">Progress</div>
      </div>
    </div>
  </div>

  <!-- Controls Section -->
  <div class="controls-section">
    <div class="navigation-controls">
      <button
        class="nav-button"
        on:click={previousImage}
        disabled={$currentImage === 1}
        title="Previous image (←)"
      >
        <span class="arrow-icon">‹</span>
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
        <span class="arrow-icon">›</span>
      </button>
    </div>

    <!-- Quick Jump Buttons -->
    <div class="quick-jump-section">
    
      
      <!-- Toggle Eye Tracking -->
      <button 
        class="jump-btn eye-tracking-toggle" 
        class:active={showEyeTracking}
        on:click={toggleEyeTracking}
        title="Toggle Eye Tracking"
      >
        👁️ Eye Tracking
      </button>

    <button 
      class="jump-btn fixation-toggle" 
      class:active={showFixations}
      on:click={toggleFixations}
      title="Toggle Fixation Points"
    >
      🎯 Fixation Points
    </button>


    </div>

    <!-- Slider Section -->
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

  <!-- Image Section -->
  <div class="image-section">
    {#if showEyeTracking}
      <!-- Eye Tracking Visualization -->
      <div class="eye-tracking-section">
        <div class="section-header">
          <h3>👁️ Eye Tracking Analysis</h3>
          <button 
            class="close-btn" 
            on:click={() => showEyeTracking = false}
            title="Close Eye Tracking"
          >
            ✕
          </button>
        </div>

        <EyeTrackingVisualization 
          imagePath={imagePath}
          imageWidth={600}
          imageHeight={450}
        />
      </div> 
    {:else if showFixations}
      <!-- Fixation Points Visualization -->
      <div class="fixation-section">
        <div class="section-header">
          <h3>🎯 Fixation Points Analysis</h3>
          <button 
            class="close-btn" 
            on:click={() => showFixations = false}
            title="Close Fixation Points"
          >
            ✕
          </button>
        </div>

        <FixationVisualization 
          imagePath={imagePath}
          imageWidth={600}
          imageHeight={450}
        />
      </div>
    {:else if showEyeTracking}
      <!-- Eye Tracking Visualization -->
      <div class="eye-tracking-section">
        <div class="section-header">
          <h3>👁️ Eye Tracking Analysis</h3>
          <button 
            class="close-btn" 
            on:click={() => showEyeTracking = false}
            title="Close Fixations"
          >
            ✕
          </button>
        </div>

        <EyeTrackingVisualization 
          imagePath={imagePath}
          imageWidth={600}
          imageHeight={450}
        />
      </div>
    {:else}
      <!-- Regular Image Display -->
      <div class="image-container">
        <div class="image-wrapper">
          {#if !imageLoaded && !imageError}
            <div class="loading-placeholder">
              <div class="loading-spinner"></div>
              <p>Loading image {$currentImage}...</p>
            </div>
          {/if}
          
          {#if imageError}
            <div class="error-placeholder">
              <div class="error-icon">📷</div>
              <p>Image {$currentImage} not available</p>
              <button class="retry-btn" on:click={() => { imageError = false; imageLoaded = false; }}>
                Retry
              </button>
            </div>
          {/if}

          <img
            bind:this={imageElement}
            src={imagePath}
            alt="Image {$currentImage}"
            class="main-image"
            class:loaded={imageLoaded}
            class:hidden={imageError}
            on:load={handleImageLoad}
            on:error={handleImageError}
          />
        </div>
        
        <div class="image-info">
          <div class="info-row">
            <span class="info-label">Image ID:</span>
            <span class="info-value">{$currentImage}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Path:</span>
            <span class="info-value">{imagePath.split('/').pop()}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Status:</span>
            <span class="info-value status" class:loaded={imageLoaded} class:error={imageError}>
              {imageLoaded ? 'Loaded' : imageError ? 'Error' : 'Loading...'}
            </span>
          </div>
          <div class="info-row">
            <button 
              class="eye-tracking-btn" 
              on:click={() => showEyeTracking = true}
              disabled={!imageLoaded}
            >
              👁️ View Eye Tracking
            </button>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .temporal-explorer {
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.8s ease;
    min-height: calc(100vh - 200px);
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .temporal-explorer.mounted {
    opacity: 1;
    transform: translateY(0);
  }

  /* Header Section */
  .header-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    flex-wrap: wrap;
    gap: 2rem;
  }

  .title-container h1 {
    font-size: 2.5rem;
    font-weight: 700;
    margin: 0 0 0.5rem 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .subtitle {
    color: rgba(255, 255, 255, 0.7);
    font-size: 1.1rem;
    margin: 0;
  }

  .quick-stats {
    display: flex;
    gap: 2rem;
  }

  .stat-item {
    text-align: center;
    background: rgba(255, 255, 255, 0.05);
    padding: 1.5rem;
    border-radius: 12px;
    min-width: 100px;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .stat-number {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .stat-label {
    font-size: 0.8rem;
    opacity: 0.7;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  /* Controls Section */
  .controls-section {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    padding: 2rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .navigation-controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2rem;
  }

  .nav-button {
    background: linear-gradient(135deg, #667eea, #764ba2);
    border: none;
    color: white;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  }

  .arrow-icon {
    font-size: 24px;
    font-weight: bold;
    line-height: 1;
  }

  .nav-button:hover:not(:disabled) {
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
  }

  .nav-button:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    transform: none;
  }

  .image-counter {
    background: rgba(255, 255, 255, 0.95);
    padding: 1rem 2rem;
    border-radius: 25px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    font-family: "Courier New", monospace;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-width: 120px;
    justify-content: center;
  }

  .current-number-input {
    font-weight: bold;
    color: #667eea;
    font-size: 1.2rem;
    background: transparent;
    border: none;
    text-align: center;
    font-family: "Courier New", monospace;
    transition: all 0.3s ease;
    width: auto;
    min-width: 30px;
    max-width: 60px;
  }

  .current-number-input:focus {
    background: rgba(102, 126, 234, 0.1);
    border-radius: 4px;
    color: #5a67d8;
    outline: none;
  }

  .separator {
    color: #999;
    font-weight: normal;
    font-size: 1.2rem;
  }

  .total-number {
    color: #666;
    font-weight: normal;
    font-size: 1.2rem;
  }

  .quick-jump-section {
    display: flex;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .jump-btn {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
    padding: 0.8rem 1.5rem;
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.9rem;
    backdrop-filter: blur(10px);
  }

  .jump-btn:hover {
    background: rgba(102, 126, 234, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }

  .eye-tracking-toggle {
    background: rgba(255, 107, 107, 0.1);
    border-color: rgba(255, 107, 107, 0.3);
  }

  .eye-tracking-toggle:hover {
    background: rgba(255, 107, 107, 0.2);
  }

  .eye-tracking-toggle.active {
    background: rgba(255, 107, 107, 0.3);
    border-color: #ff6b6b;
  }

  .slider-container {
    position: relative;
    padding: 1rem 0;
  }

  .slider {
    width: 100%;
    height: 8px;
    border-radius: 4px;
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
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #fff;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease;
    border: 3px solid #667eea;
  }

  .slider::-webkit-slider-thumb:hover {
    transform: scale(1.2);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
  }

  .slider-markers {
    display: flex;
    justify-content: space-between;
    margin-top: 1rem;
    position: relative;
    height: 20px;
  }

  .marker {
    position: absolute;
    transform: translateX(-50%);
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.5);
    transition: all 0.3s ease;
    font-family: "Courier New", monospace;
  }

  .marker.active {
    color: #667eea;
    font-weight: bold;
    transform: translateX(-50%) scale(1.2);
  }

  /* Image Section */
  .image-section {
    flex: 1;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    padding: 2rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    flex-direction: column;
    min-height: 600px;
  }

  .image-container {
    display: flex;
    flex: 1;
    gap: 2rem;
  }

  .image-wrapper {
    flex: 3;
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.03);
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 500px;
  }

  .main-image {
    max-width: 50%;
    max-height: 50%;
    width: 50%;
    height: auto;
    border-radius: 8px;
    opacity: 0;
    transition: opacity 0.5s ease;
    object-fit: cover;
    min-height: 400px;
  }

  .main-image.loaded {
    opacity: 1;
  }

  .main-image.hidden {
    display: none;
  }

  .loading-placeholder,
  .error-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    color: rgba(255, 255, 255, 0.6);
    text-align: center;
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-top: 3px solid #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .error-icon {
    font-size: 3rem;
    opacity: 0.6;
  }

  .retry-btn {
    background: rgba(102, 126, 234, 0.2);
    border: 1px solid rgba(102, 126, 234, 0.3);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .retry-btn:hover {
    background: rgba(102, 126, 234, 0.4);
  }

  .image-info {
    flex: 1;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 12px;
    padding: 2rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .info-row:last-child {
    border-bottom: none;
  }

  .info-label {
    font-weight: 600;
    color: rgba(255, 255, 255, 0.8);
  }

  .info-value {
    font-family: "Courier New", monospace;
    color: #667eea;
  }

  .status.loaded {
    color: #4CAF50;
  }

  .status.error {
    color: #F44336;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* Responsive Design */
  @media (max-width: 1024px) {
    .image-container {
      flex-direction: column;
    }

    .image-wrapper {
      min-height: 200px;
    }

    .main-image {
      width: 70%;
      max-width: 70%;
      min-height: 150px;
    }
    
    .quick-stats {
      flex-direction: column;
      gap: 1rem;
    }

    .header-section {
      flex-direction: column;
      align-items: stretch;
    }
  }

  @media (max-width: 768px) {
    .temporal-explorer {
      gap: 1rem;
    }

    .header-section,
    .controls-section,
    .image-section {
      padding: 1rem;
    }

    .title-container h1 {
      font-size: 2rem;
    }

    .quick-jump-section {
      grid-template-columns: repeat(2, 1fr);
    }

    .image-wrapper {
      min-height: 175px;
    }

    .main-image {
      min-height: 120px;
      width: 80%;
      max-width: 80%;
    }
  }
    .status.error {
    color: #F44336;
  }

  .eye-tracking-btn {
    background: linear-gradient(135deg, #ff6b6b, #ee5a52);
    border: none;
    color: white;
    padding: 0.8rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.9rem;
    font-weight: 500;
    width: 100%;
    margin-top: 0.5rem;
  }

  .eye-tracking-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 107, 107, 0.4);
  }

  .eye-tracking-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  /* Eye Tracking Section */
  .eye-tracking-section {
    background: rgba(255, 255, 255, 0.03);
    border-radius: 12px;
    padding: 1.5rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    height: 100%;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .section-header h3 {
    margin: 0;
    color: #ff6b6b;
    font-size: 1.2rem;
  }

  .close-btn {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
    padding: 0.5rem;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s ease;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
  }

  .close-btn:hover {
    background: rgba(255, 107, 107, 0.3);
    border-color: #ff6b6b;
  }

  .fixation-toggle {
  background: rgba(255, 107, 53, 0.1);
  border-color: rgba(255, 107, 53, 0.3);
  }

  .fixation-toggle:hover {
    background: rgba(255, 107, 53, 0.2);
  }

  .fixation-toggle.active {
    background: rgba(255, 107, 53, 0.3);
    border-color: #ff6b35;
  }

  .fixation-section {
    background: rgba(255, 255, 255, 0.03);
    border-radius: 12px;
    padding: 1.5rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    height: 100%;
  }
</style>