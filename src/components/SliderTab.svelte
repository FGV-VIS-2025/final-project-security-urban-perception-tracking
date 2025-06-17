<script>
  import { eyeTrackingImage, config, getImagePath  } from "../stores/appStore.js";
  //import { currentImage, config } from "../stores/appStore.js";
  import { onMount } from "svelte";
  import { base } from "$app/paths";

  let imageElement;
  let imageLoaded = false;
  let imageError = false;
  let mounted = false;

  $: currentConfig = $config;
  // Convertir el currentImage (que va de 1-150) a índice de imagen (0-149)
  //$: imageIndex = $eyeTrackingImage - 1;
  //$: imagePath = `${currentConfig.imageBasePath}${currentConfig.imagePrefix}${imageIndex}${currentConfig.imageExtension}`;
  $: imagePath = getImagePath($eyeTrackingImage, currentConfig);
  onMount(() => {
    mounted = true;
  });

  function handleSliderChange(event) {
    const newValue = parseInt(event.target.value);
    //Actualizamos eyeTrackingImage en vez de currentImage
    eyeTrackingImage.set(newValue);
    //currentImage.set(newValue);
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
    if ($eyeTrackingImage > 1) { //update
      eyeTrackingImage.set($eyeTrackingImage - 1); //update
    }
  }

  function nextImage() {
    if ($eyeTrackingImage < currentConfig.imageCount) { //update
      eyeTrackingImage.set($eyeTrackingImage + 1); //update
    }
  }

  function jumpToImage(imageNumber) {
    if (imageNumber >= 1 && imageNumber <= currentConfig.imageCount) {
      eyeTrackingImage.set(imageNumber); //update
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

<!-- Slider "Eye tracking Vis" -->
<div class="slider-section" class:mounted>
  <h2>🖼️ Time Browsing</h2>
  <p class="description">
    Navigate through images (1-{currentConfig.imageCount}) using controls or arrow keys.
  </p>

  
  <div class="controls-section">
    <div class="navigation-controls">
      <button
        class="nav-button"
        on:click={previousImage}
        disabled={$eyeTrackingImage === 1}
        title="Previous image (←)"
      >
        <span class="arrow-icon">‹</span>
      </button>

      <div class="image-counter">
        <input
          type="number"
          min="1"
          max={currentConfig.imageCount}
          value={$eyeTrackingImage}
          class="current-number-input"
          on:input={handleManualInput}
          on:keydown={handleInputKeydown}
          title="Enter point number (1-{currentConfig.imageCount})"
        />
        <span class="separator">/</span>
        <span class="total-number">{currentConfig.imageCount}</span>
      </div>

      <button
        class="nav-button"
        on:click={nextImage}
        disabled={$eyeTrackingImage === currentConfig.imageCount}
        title="Next image (→)"
      >
        <span class="arrow-icon">›</span>
      </button>
    </div>

    <div class="slider-container">
      <input
        type="range"
        min="1"
        max={currentConfig.imageCount}
        value={$eyeTrackingImage}
        class="slider"
        on:input={handleSliderChange}
        title="Slide to change point"
      />

      <div class="slider-markers">
        {#each Array(Math.min(6, currentConfig.imageCount)) as _, i}
          {@const markerValue = Math.floor(
            1 +
              ((currentConfig.imageCount - 1) * i) /
                Math.min(5, currentConfig.imageCount - 1),
          )}
          <div
            class="marker"
            style="left: {(i / Math.min(5, currentConfig.imageCount - 1)) *
              100}%"
            class:active={Math.abs($eyeTrackingImage - markerValue) < 5}
          >
            {markerValue}
          </div>
        {/each}
      </div>
    </div>
  </div>

  <div class="image-container">
    <img
      bind:this={imageElement}
      src={imagePath}
      alt="Point {$eyeTrackingImage} - Image {imageIndex}.jpg"
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
    margin: 0 0 0.5rem 0;
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.8rem;
    line-height: 1;
    flex-shrink: 0;
  }

  .controls-section {
    background: rgba(255, 255, 255, 0.03);
    border-radius: 8px;
    padding: 1rem;
  }

  .navigation-controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }

  .nav-button {
    background: linear-gradient(135deg, #667eea, #764ba2);
    border: none;
    color: white;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .arrow-icon {
    font-size: 18px;
    font-weight: bold;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .nav-button:hover:not(:disabled) {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  .nav-button:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    transform: none;
  }

  .image-counter {
    background: rgba(255, 255, 255, 0.95);
    padding: 0.5rem 1.2rem;
    border-radius: 25px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    font-family: "Courier New", monospace;
    display: flex;
    align-items: center;
    gap: 0.3rem;
    min-width: 90px;
    justify-content: center;
  }

  .current-number-input {
    font-weight: bold;
    color: #667eea;
    font-size: 0.9rem;
    background: transparent;
    border: none;
    text-align: center;
    font-family: "Courier New", monospace;
    transition: all 0.3s ease;
    width: auto;
    min-width: 20px;
    max-width: 40px;
  }

  .current-number-input:focus {
    background: rgba(102, 126, 234, 0.1);
    border-radius: 4px;
    color: #5a67d8;
    outline: none;
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
    color: #999;
    font-weight: normal;
    font-size: 0.9rem;
  }

  .total-number {
    color: #666;
    font-weight: normal;
    font-size: 0.9rem;
  }

  .slider-container {
    position: relative;
    padding: 0.5rem 0;
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
    height: 16px;
  }

  .marker {
    position: absolute;
    transform: translateX(-50%);
    font-size: 0.7rem;
    color: rgba(255, 255, 255, 0.5);
    transition: all 0.3s ease;
    font-family: "Courier New", monospace;
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
    min-height: 400px;
    max-height: 500px;
    margin-top: 1rem;
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

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
