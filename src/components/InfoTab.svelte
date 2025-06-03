<script>
  import { onMount } from "svelte";
  import ClockIcon from "../lib/Icons/ClockIcon.svelte";
  import DataBaseIcon from "../lib/Icons/DataBaseIcon.svelte";
  import ChartIcon from "../lib/Icons/ChartIcon.svelte";
  import ChartIcon2 from "../lib/Icons/ChartIcon2.svelte";
  import UserIcon from "../lib/Icons/UserIcon.svelte";
  import WorldsIcon from "../lib/Icons/WorldsIcon.svelte";
  import TeachIcon from "../lib/Icons/TeachIcon.svelte";
  import BrainIcon from "../lib/Icons/BrainIcon.svelte";
  import ClockIcon2 from "../lib/Icons/ClockIcon2.svelte";
  import TargetIcon from "../lib/Icons/TargetIcon.svelte";
  import MapIcon from "../lib/Icons/MapIcon.svelte";
  import FeatureIcon from "../lib/Icons/FeatureIcon.svelte";
  import PictureIcon from "../lib/Icons/PictureIcon.svelte";
  import FlashIcon from "../lib/Icons/FlashIcon.svelte";

  let mounted = false;
  let currentParticle = 0;

  onMount(() => {
    mounted = true;

    // Animación continua de partículas flotantes
    setInterval(() => {
      currentParticle = (currentParticle + 1) % 20;
    }, 3000);
  });
</script>

<div class="spectacular-container" class:mounted>
  <!-- Partículas flotantes animadas -->
  <div class="floating-particles">
    {#each Array(15) as _, i}
      <div
        class="particle"
        style="--delay: {i * 0.3}s; --x: {Math.random() *
          100}%; --y: {Math.random() * 100}%"
      ></div>
    {/each}
  </div>

  <!-- Hero Section con efecto wow -->
  <section class="hero-section">
    <div class="hero-content">
      <div class="hero-icon">
        <TeachIcon size={80} />
      </div>
      <h1 class="hero-title">
        <span class="title-gradient">SECURITY URBAN PERCEPTION TRACKING</span>
        <span class="title-secondary">Eye Tracking • Rio de Janeiro</span>
      </h1>
      <p class="hero-description">
        A revolutionary platform that combines <strong>Svelte</strong> and
        <strong>D3.js</strong>
        to explore geospatial and temporal data in an immersive and captivating way.
      </p>
      <div class="hero-stats">
        <div class="stat-bubble">
          <UserIcon size={30} />
          <span>30 Participants</span>
        </div>
        <div class="stat-bubble">
          <PictureIcon size={30} />
          <span>1,500 Observations</span>
        </div>
        <div class="stat-bubble">
          <ClockIcon2 size={30} />
          <span>375 Minutes</span>
        </div>
      </div>
    </div>
    <div class="hero-visual">
      <div class="pulsing-circle">
        <div class="inner-circle">
          <WorldsIcon color={"blue"} size={60} />
        </div>
      </div>
    </div>
  </section>

  <!-- Objetivos con cards flotantes -->
  <section class="objectives-section">
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
          Seamless navigation through time using interactive controls that
          reveal temporal patterns in eye-tracking data.
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
          Interactive maps that reveal the spatial distribution of the
          perception of safety in different locations in Rio de Janeiro.
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

  <!-- Metodología con diseño llamativo -->
  <section class="methodology-section">
    <div class="methodology-container">
      <div class="methodology-header">
        <div class="method-icon">
          <FeatureIcon size={60} />
        </div>
        <h2>Research Methodology</h2>
      </div>

      <div class="methodology-flow">
        <div class="flow-step">
          <div class="step-number">01</div>
          <div class="step-content">
            <h4>Selection of Participants</h4>
            <p>30 volunteers evaluated images of Rio de Janeiro</p>
          </div>
        </div>

        <div class="flow-arrow">→</div>

        <div class="flow-step">
          <div class="step-number">02</div>
          <div class="step-content">
            <h4>Observation Protocol</h4>
            <p>50 images × 15 seconds each</p>
          </div>
        </div>

        <div class="flow-arrow">→</div>

        <div class="flow-step">
          <div class="step-number">03</div>
          <div class="step-content">
            <h4>Evaluation</h4>
            <p>Scale of 1-10 (unsafe → safe)</p>
          </div>
        </div>
      </div>

      <div class="data-showcase">
        <div class="data-card">
          <div class="data-icon"><UserIcon color={"black"} size={40} /></div>
          <div class="data-info">
            <span class="data-number">30</span>
            <span class="data-label">Participants</span>
          </div>
        </div>

        <div class="data-card">
          <div class="data-icon"><PictureIcon color={"black"} size={40} /></div>
          <div class="data-info">
            <span class="data-number">50</span>
            <span class="data-label">Images</span>
          </div>
        </div>

        <div class="data-card">
          <div class="data-icon"><ClockIcon color={"black"} size={40} /></div>
          <div class="data-info">
            <span class="data-number">15</span>
            <span class="data-label">Seconds</span>
          </div>
        </div>
      </div>
    </div>
  </section>
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

  <!-- Features con animaciones impresionantes -->
  <section class="features-section">
    <div class="features-header">
      <h2>Key Features</h2>
      <p>Features designed for an immersive experience</p>
    </div>

    <div class="features-grid">
      <div class="feature-card visualization">
        <div class="feature-icon">
          <PictureIcon color={"black"} size={50} />
        </div>
        <h3>Dynamic Visualization</h3>
        <p>
          Interactive sliders that allow you to explore images with advanced
          time controls
        </p>
        <div class="feature-accent"></div>
      </div>

      <div class="feature-card mapping">
        <div class="feature-icon">
          <MapIcon color={"black"} size={50} />
        </div>
        <h3>Mapping Interactive</h3>
        <p>
          Detailed map of Rio de Janeiro with zoom and geographic exploration
          capabilities
        </p>
        <div class="feature-accent"></div>
      </div>

      <div class="feature-card performance">
        <div class="feature-icon">
          <FlashIcon color={"black"} size={50} />
        </div>
        <h3>Optimized Performance</h3>
        <p>
          Powered by Svelte for maximum speed and efficiency in data
          visualization
        </p>
        <div class="feature-accent"></div>
      </div>
    </div>
  </section>
</div>

<style>
  .spectacular-container {
    position: relative;
    background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
    min-height: 100vh;
    overflow: hidden;
    opacity: 0;
    transform: scale(0.95);
    transition: all 1.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .spectacular-container.mounted {
    opacity: 1;
    transform: scale(1);
  }

  /* Partículas flotantes */
  .floating-particles {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
  }

  .particle {
    position: absolute;
    width: 4px;
    height: 4px;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 50%;
    left: var(--x);
    top: var(--y);
    animation: float 6s infinite ease-in-out;
    animation-delay: var(--delay);
  }

  @keyframes float {
    0%,
    100% {
      transform: translateY(0) rotate(0deg);
      opacity: 0;
    }
    50% {
      transform: translateY(-100px) rotate(180deg);
      opacity: 1;
    }
  }

  /* Hero Section */
  .hero-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 60px 40px;
    position: relative;
    z-index: 2;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    margin: 20px;
    border-radius: 25px;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .hero-content {
    flex: 1;
    max-width: 800px;
  }

  .hero-icon {
    animation: pulse 2s infinite;
    margin-bottom: 20px;
  }

  @keyframes pulse {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
  }

  .hero-title {
    margin: 0 0 30px 0;
  }

  .title-gradient {
    display: block;
    font-size: 3.5rem;
    font-weight: 800;
    background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 3s infinite;
  }

  .title-secondary {
    display: block;
    font-size: 1.4rem;
    color: rgba(255, 255, 255, 0.8);
    font-weight: 300;
    margin-top: 10px;
  }

  @keyframes shimmer {
    0%,
    100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }

  .hero-description {
    font-size: 1.2rem;
    color: rgba(255, 255, 255, 0.9);
    line-height: 1.6;
    margin-bottom: 30px;
  }

  .hero-stats {
    display: flex;
    gap: 5px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .stat-bubble {
    background: rgba(255, 255, 255, 0.2);
    padding: 12px 20px;
    border-radius: 50px;
    display: flex;
    align-items: center;
    gap: 10px;
    color: white;
    font-weight: 600;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    transition: all 0.3s ease;
  }

  .stat-bubble:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }

  .hero-visual {
    flex: 0 0 300px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .pulsing-circle {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.3),
      rgba(240, 147, 251, 0.3)
    );
    display: flex;
    align-items: center;
    justify-content: center;
    animation: rotate 20s linear infinite;
    position: relative;
  }

  .pulsing-circle::before {
    content: "";
    position: absolute;
    width: 220px;
    height: 220px;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.3);
    animation: pulse-ring 2s infinite;
  }

  .inner-circle {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #667eea;
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes pulse-ring {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    100% {
      transform: scale(1.2);
      opacity: 0;
    }
  }

  /* Objectives Section */
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

  /* Methodology Section */
  .methodology-section {
    padding: 80px 40px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    margin: 40px 20px;
    border-radius: 25px;
    position: relative;
    z-index: 2;
  }

  .methodology-container {
    max-width: 1000px;
    margin: 0 auto;
  }

  .methodology-header {
    text-align: center;
    margin-bottom: 50px;
    color: white;
  }

  .method-icon {
    animation: rotate 10s linear infinite;
    margin-bottom: 20px;
  }

  .methodology-header h2 {
    font-size: 2.5rem;
    font-weight: 700;
  }

  .methodology-flow {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 50px;
    flex-wrap: wrap;
    gap: 20px;
  }

  .flow-step {
    background: rgba(255, 255, 255, 0.9);
    padding: 30px 25px;
    border-radius: 15px;
    text-align: center;
    position: relative;
    min-width: 200px;
    transition: all 0.3s ease;
  }

  .flow-step:hover {
    transform: scale(1.05);
  }

  .step-number {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);

    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    margin: 0 auto 15px;
  }

  .step-content h4 {
    color: #333;
    margin-bottom: 10px;
    font-size: 1.2rem;
  }

  .step-content p {
    color: #666;
    font-size: 0.95rem;
  }

  .flow-arrow {
    font-size: 2rem;
    color: white;
    font-weight: bold;
  }

  .data-showcase {
    display: flex;
    justify-content: center;
    gap: 30px;
    flex-wrap: wrap;
  }

  .data-card {
    background: rgba(255, 255, 255, 0.95);
    padding: 25px;
    border-radius: 15px;
    display: flex;
    align-items: center;
    gap: 20px;
    transition: all 0.3s ease;
    min-width: 180px;
  }

  .data-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  }

  .data-icon {
    color: #667eea;
  }

  .data-info {
    display: flex;
    flex-direction: column;
  }

  .data-number {
    font-size: 2rem;
    font-weight: 800;
    color: #333;
  }

  .data-label {
    color: #666;
    font-size: 0.9rem;
  }

  /* Dataset Section */
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

  /* Features Section */
  .features-section {
    padding: 80px 40px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    margin: 40px 20px 20px;
    border-radius: 25px;
    position: relative;
    z-index: 2;
  }

  .features-header {
    text-align: center;
    margin-bottom: 60px;
    color: white;
  }

  .features-header h2 {
    font-size: 2.8rem;
    font-weight: 700;
    margin-bottom: 15px;
  }

  .features-header p {
    font-size: 1.2rem;
    opacity: 0.9;
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 30px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .feature-card {
    background: rgba(255, 255, 255, 0.95);
    padding: 35px 25px;
    border-radius: 20px;
    text-align: center;
    position: relative;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(20px);
  }

  .feature-card:hover {
    transform: translateY(-15px) scale(1.02);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
  }

  .feature-icon {
    margin-bottom: 20px;
    color: #667eea;
    animation: icon-float 3s ease-in-out infinite;
  }

  @keyframes icon-float {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-8px);
    }
  }

  .feature-card h3 {
    font-size: 1.5rem;
    color: #333;
    margin-bottom: 15px;
    font-weight: 700;
  }

  .feature-card p {
    color: #666;
    line-height: 1.6;
    font-size: 1rem;
  }

  .feature-accent {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 4px;
    transition: all 0.3s ease;
  }

  .feature-card.visualization .feature-accent {
    background: linear-gradient(90deg, #f093fb, #f5576c);
  }

  .feature-card.mapping .feature-accent {
    background: linear-gradient(90deg, #4facfe, #00f2fe);
  }

  .feature-card.performance .feature-accent {
    background: linear-gradient(90deg, #43e97b, #38f9d7);
  }

  .feature-card:hover .feature-accent {
    height: 100%;
    opacity: 0.1;
    border-radius: 20px;
  }

  /* Animaciones adicionales */
  .feature-card::before {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      45deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
    transform: rotate(45deg);
    transition: all 0.6s ease;
    opacity: 0;
  }

  .feature-card:hover::before {
    animation: shine 0.6s ease-in-out;
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

  .feature-card.visualization:hover .feature-icon {
    animation: picture-zoom 0.6s ease-in-out;
  }

  .feature-card.mapping:hover .feature-icon {
    animation: map-bounce 0.8s ease-in-out;
  }

  .feature-card.performance:hover .feature-icon {
    animation: flash-pulse 0.5s ease-in-out;
  }

  @keyframes target-spin {
    0%,
    100% {
      transform: rotate(0deg) scale(1);
    }
    50% {
      transform: rotate(180deg) scale(1.2);
    }
  }

  @keyframes picture-zoom {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.3);
    }
  }

  @keyframes map-bounce {
    0%,
    100% {
      transform: translateY(0);
    }
    25% {
      transform: translateY(-15px);
    }
    50% {
      transform: translateY(-8px);
    }
    75% {
      transform: translateY(-12px);
    }
  }

  @keyframes flash-pulse {
    0%,
    100% {
      transform: scale(1);
      filter: brightness(1);
    }
    50% {
      transform: scale(1.2);
      filter: brightness(1.5);
    }
  }

  /* Responsive adjustments */
  .hero-section {
    flex-direction: column;
    text-align: center;
    gap: 40px;
  }

  .hero-visual {
    flex: none;
  }

  .title-gradient {
    font-size: 2.8rem;
  }

  .dataset-container {
    flex-direction: column;
    text-align: center;
    gap: 40px;
  }

  .methodology-flow {
    flex-direction: column;
  }

  .flow-arrow {
    transform: rotate(90deg);
  }

  .spectacular-container::before {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(
        circle at 20% 80%,
        rgba(102, 126, 234, 0.3) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 80% 20%,
        rgba(118, 75, 162, 0.3) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 40% 40%,
        rgba(240, 147, 251, 0.2) 0%,
        transparent 50%
      );
    pointer-events: none;
    z-index: 0;
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
