<script>
  import DataBaseIcon from "../../lib/Icons/DataBaseIcon.svelte";
</script>

<section class="dataset-section">
  <div class="dataset-container">
    <div class="dataset-visual">
      <div class="data-orb">
        <DataBaseIcon size={70} />
        <div class="orb-rings">
          <div class="ring ring-1"></div>
          <div class="ring ring-2"></div>
          <div class="ring ring-3"></div>
        </div>
      </div>
    </div>
    <div class="dataset-info">
      <h2>Complex Dataset</h2>
      <p class="dataset-description">
        Our dataset comprises <span class="highlight-number"
          >150 unique indexed elements</span
        >
        each with a visual representation and precise geographic location in the
        <span class="highlight-location"
          >Rio de Janeiro metropolitan region, Brazil</span
        >.
      </p>
      <div class="dataset-stats">
        <div class="stat-item">
          <strong>150</strong>
          <span>Indexed Elements</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <strong>1,500</strong>
          <span>Data Points</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <strong>Rio</strong>
          <span>Location</span>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .dataset-container {
    flex-direction: column;
    text-align: center;
    gap: 40px;
  }

  .dataset-section {
    padding: 80px 40px;
    position: relative;
    z-index: 2;
  }

  .dataset-container {
    display: flex;
    align-items: center;
    gap: 60px;
    max-width: 1000px;
    margin: 0 auto;
  }

  .dataset-visual {
    flex: 0 0 250px;
    display: flex;
    justify-content: center;
  }

  .data-orb {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }

  .orb-rings {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .ring {
    position: absolute;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .ring-1 {
    width: 120px;
    height: 120px;
    animation: ring-pulse 2s infinite;
  }

  .ring-2 {
    width: 160px;
    height: 160px;
    animation: ring-pulse 2s infinite 0.5s;
  }

  .ring-3 {
    width: 200px;
    height: 200px;
    animation: ring-pulse 2s infinite 1s;
  }

  @keyframes ring-pulse {
    0%,
    100% {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
    50% {
      opacity: 0.3;
      transform: translate(-50%, -50%) scale(1.1);
    }
  }

  .dataset-info {
    flex: 1;
    color: white;
  }

  .dataset-info h2 {
    font-size: 2.5rem;
    margin-bottom: 25px;
    font-weight: 700;
  }

  .dataset-description {
    font-size: 1.2rem;
    line-height: 1.6;
    margin-bottom: 30px;
  }

  .highlight-number {
    background: linear-gradient(45deg, #f093fb, #f5576c);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: 800;
  }

  .highlight-location {
    background: linear-gradient(45deg, #4facfe, #00f2fe);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: 600;
  }

  .dataset-stats {
    display: flex;
    gap: 20px;
    align-items: center;
    justify-content: center;
  }

  .stat-item {
    text-align: center;
  }

  .stat-item strong {
    display: block;
    font-size: 1.8rem;
    font-weight: 800;
  }

  .stat-item span {
    font-size: 0.9rem;
    opacity: 0.8;
  }

  .stat-divider {
    width: 2px;
    height: 40px;
    background: rgba(255, 255, 255, 0.3);
  }
</style>
