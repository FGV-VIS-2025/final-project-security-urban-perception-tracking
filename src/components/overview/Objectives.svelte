<script>
  import BrainIcon from "../../lib/Icons/BrainIcon.svelte";
  import ClockIcon from "../../lib/Icons/ClockIcon.svelte";
  import FeatureIcon from "../../lib/Icons/FeatureIcon.svelte";
  import WorldsIcon from "../../lib/Icons/WorldsIcon.svelte";
</script>

<section class="objectives-section" id="objectives-section">
  <div class="section-header">
    <FeatureIcon size={50} />
    <h2>Project Objectives</h2>
    <div class="section-line"></div>
  </div>

  <div class="floating-objectives">
    <div class="objective-float-card primary">
      <div class="card-glow"></div>
      <div class="objective-icon-container">
        <ClockIcon size={55} />
      </div>
      <h3>Temporal Exploration</h3>
      <p>
        Seamless navigation through time using interactive controls that reveal
        temporal patterns in eye-tracking data.
      </p>
      <div class="card-sparkles">
        <div class="sparkle"></div>
        <div class="sparkle"></div>
        <div class="sparkle"></div>
      </div>
    </div>

    <div class="objective-float-card secondary">
      <div class="card-glow"></div>
      <div class="objective-icon-container">
        <WorldsIcon size={55} />
      </div>
      <h3>Geospatial Analysis</h3>
      <p>
        Interactive maps that reveal the spatial distribution of the perception
        of safety in different locations in Rio de Janeiro.
      </p>
      <div class="card-sparkles">
        <div class="sparkle"></div>
        <div class="sparkle"></div>
        <div class="sparkle"></div>
      </div>
    </div>

    <div class="objective-float-card tertiary">
      <div class="card-glow"></div>
      <div class="objective-icon-container">
        <BrainIcon size={55} />
      </div>
      <h3>Comprehensive Understanding</h3>
      <p>
        Combining multiple visualization forms to gain deep and meaningful
        insights into urban perception.
      </p>
      <div class="card-sparkles">
        <div class="sparkle"></div>
        <div class="sparkle"></div>
        <div class="sparkle"></div>
      </div>
    </div>
  </div>
</section>

<style>
  .objectives-section {
    padding: 80px 40px;
    position: relative;
    z-index: 2;
  }

  .section-header {
    text-align: center;
    margin-bottom: 60px;
    color: white;
  }

  .section-header h2 {
    font-size: 2.8rem;
    margin: 20px 0;
    font-weight: 700;
  }

  .section-line {
    width: 100px;
    height: 4px;
    background: linear-gradient(90deg, transparent, white, transparent);
    margin: 20px auto;
    border-radius: 2px;
  }

  .floating-objectives {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 40px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .objective-float-card {
    background: rgba(255, 255, 255, 0.95);
    padding: 40px 30px;
    border-radius: 20px;
    position: relative;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.3);
  }

  .objective-float-card:hover {
    transform: translateY(-15px) rotateX(5deg);
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3);
  }

  .card-glow {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    border-radius: 20px 20px 0 0;
  }

  .objective-float-card.primary .card-glow {
    background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  }

  .objective-float-card.secondary .card-glow {
    background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  }

  .objective-float-card.tertiary .card-glow {
    background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  }

  .objective-icon-container {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);

    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    margin-bottom: 25px;
    animation: bounce 2s infinite;
  }

  @keyframes bounce {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  .objective-float-card h3 {
    font-size: 1.6rem;
    font-weight: 700;
    color: #333;
    margin-bottom: 15px;
  }

  .objective-float-card p {
    color: #666;
    line-height: 1.6;
    font-size: 1.1rem;
  }

  .card-sparkles {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
  }

  .sparkle {
    position: absolute;
    width: 6px;
    height: 6px;
    background: #667eea;
    border-radius: 50%;
    animation: sparkle 3s infinite;
  }

  .sparkle:nth-child(1) {
    top: 20%;
    right: 15%;
    animation-delay: 0s;
  }
  .sparkle:nth-child(2) {
    bottom: 25%;
    left: 20%;
    animation-delay: 1s;
  }
  .sparkle:nth-child(3) {
    top: 60%;
    right: 25%;
    animation-delay: 2s;
  }

  @keyframes sparkle {
    0%,
    100% {
      opacity: 0;
      transform: scale(0);
    }
    50% {
      opacity: 1;
      transform: scale(1);
    }
  }

  .section-header::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 2px;
    height: 100px;
    background: linear-gradient(
      to bottom,
      transparent,
      rgba(255, 255, 255, 0.5),
      transparent
    );
    animation: vertical-shine 4s infinite;
  }

  @keyframes shine {
    0% {
      transform: translateX(-100%) translateY(-100%) rotate(45deg);
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      transform: translateX(100%) translateY(100%) rotate(45deg);
      opacity: 0;
    }
  }

  @keyframes vertical-shine {
    0%,
    100% {
      opacity: 0;
      height: 0px;
    }
    50% {
      opacity: 1;
      height: 100px;
    }
  }
</style>
