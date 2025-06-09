<script>
  import BrainIcon from "../../lib/Icons/BrainIcon.svelte";
  import ClockIcon from "../../lib/Icons/ClockIcon.svelte";
  import FeatureIcon from "../../lib/Icons/FeatureIcon.svelte";
  import WorldsIcon from "../../lib/Icons/WorldsIcon.svelte";
</script>

<section class="objectives-section" id="objectives-section">
  <div class="transition-gradient"></div>
  
  <div class="cyber-grid"></div>
  <div class="floating-particles">
    <div class="particle"></div>
    <div class="particle"></div>
    <div class="particle"></div>
    <div class="particle"></div>
    <div class="particle"></div>
  </div>
  
  <div class="section-header">
    <div class="header-pulse"></div>
    <div class="icon-hexagon">
      <FeatureIcon size={45} />
    </div>
    <h2 class="cyber-title">
      <span class="title-line">PROJECT</span>
      <span class="title-line accent">OBJECTIVES</span>
    </h2>
    <div class="data-stream"></div>
  </div>

  <div class="objectives-grid">
    <div class="objective-card temporal">
      <div class="card-frame">
        <div class="corner top-left"></div>
        <div class="corner top-right"></div>
        <div class="corner bottom-left"></div>
        <div class="corner bottom-right"></div>
      </div>
      <div class="icon-chamber">
        <div class="energy-ring"></div>
        <ClockIcon size={48} />
      </div>
      <div class="data-block">
        <h3 class="objective-title">Temporal Exploration</h3>
        <div class="title-underline"></div>
        <p class="objective-desc">
          Seamless navigation through time using interactive controls that reveal
          temporal patterns in eye-tracking data.
        </p>
      </div>
    </div>

    <div class="objective-card geospatial">
      <div class="card-frame">
        <div class="corner top-left"></div>
        <div class="corner top-right"></div>
        <div class="corner bottom-left"></div>
        <div class="corner bottom-right"></div>
      </div>
      <div class="icon-chamber">
        <div class="energy-ring"></div>
        <WorldsIcon size={48} />
      </div>
      <div class="data-block">
        <h3 class="objective-title">Geospatial Analysis</h3>
        <div class="title-underline"></div>
        <p class="objective-desc">
          Interactive maps that reveal the spatial distribution of the perception
          of safety in different locations in Rio de Janeiro.
        </p>
      </div>
    </div>

    <div class="objective-card comprehensive">
      <div class="card-frame">
        <div class="corner top-left"></div>
        <div class="corner top-right"></div>
        <div class="corner bottom-left"></div>
        <div class="corner bottom-right"></div>
      </div>
      <div class="icon-chamber">
        <div class="energy-ring"></div>
        <BrainIcon size={48} />
      </div>
      <div class="data-block">
        <h3 class="objective-title">Comprehensive Understanding</h3>
        <div class="title-underline"></div>
        <p class="objective-desc">
          Combining multiple visualization forms to gain deep and meaningful
          insights into urban perception.
        </p>
      </div>
    </div>
  </div>
</section>

<style>
  .objectives-section {
    padding: 140px 80px;
    position: relative;
    background: 
      radial-gradient(ellipse at 30% 20%, rgba(0, 212, 255, 0.04) 0%, transparent 45%),
      radial-gradient(ellipse at 70% 80%, rgba(255, 107, 0, 0.03) 0%, transparent 45%),
      linear-gradient(180deg, #16213e 0%, #1a1a2e 25%, #15192a 60%, #0f1218 100%);
    overflow: hidden;
    min-height: 100vh;
  }

  .transition-gradient {
    position: absolute;
    top: -120px;
    left: 0;
    right: 0;
    height: 240px;
    background: linear-gradient(
      170deg,
      rgba(22, 33, 62, 0.9) 0%,
      rgba(26, 26, 46, 0.7) 25%,
      rgba(21, 25, 42, 0.5) 50%,
      rgba(15, 18, 24, 0.3) 75%,
      transparent 100%
    );
    z-index: 1;
  }

  .cyber-grid {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
    background-size: 80px 80px;
    animation: grid-shift 25s linear infinite;
    opacity: 0.15;
  }

  .floating-particles {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
  }

  .particle {
    position: absolute;
    width: 1.5px;
    height: 1.5px;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 50%;
    box-shadow: 0 0 6px rgba(255, 255, 255, 0.3);
    animation: particle-float 12s infinite linear;
  }

  .particle:nth-child(1) { left: 15%; animation-delay: 0s; }
  .particle:nth-child(2) { left: 35%; animation-delay: 3s; }
  .particle:nth-child(3) { left: 55%; animation-delay: 6s; }
  .particle:nth-child(4) { left: 75%; animation-delay: 9s; }
  .particle:nth-child(5) { left: 85%; animation-delay: 1.5s; }

  .section-header {
    text-align: center;
    margin-bottom: 100px;
    position: relative;
    z-index: 3;
  }

  .header-pulse {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 180px;
    height: 180px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 50%;
    animation: pulse-ring 4s infinite;
  }

  .icon-hexagon {
    width: 110px;
    height: 110px;
    margin: 0 auto 40px;
    background: 
      linear-gradient(135deg, rgba(0, 0, 0, 0.4), rgba(255, 255, 255, 0.03)),
      radial-gradient(circle, rgba(0, 212, 255, 0.05) 0%, transparent 70%);
    backdrop-filter: blur(20px);
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.8);
    position: relative;
    border: 1px solid rgba(255, 255, 255, 0.1);
    animation: hexagon-rotate 15s linear infinite;
  }

  .cyber-title {
    font-size: 3.6rem;
    font-weight: 900;
    margin: 30px 0;
    text-align: center;
    perspective: 1000px;
  }

  .title-line {
    display: block;
    color: rgba(255, 255, 255, 0.9);
    text-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
    transform: rotateX(0deg);
    transition: all 0.6s ease;
    letter-spacing: 5px;
  }

  .title-line.accent {
    background: linear-gradient(90deg, #ffffff 0%, #00d4ff 40%, #ffffff 80%);
    background-size: 200% 100%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: cyber-glow 5s ease-in-out infinite;
    margin-top: -15px;
    opacity: 0.95;
  }

  .data-stream {
    width: 120px;
    height: 2px;
    margin: 40px auto;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    animation: data-flow 3s linear infinite;
    position: relative;
  }

  .data-stream::after {
    content: '';
    position: absolute;
    top: -1px;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
    animation: data-flow 3s linear infinite reverse;
  }

  .objectives-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(420px, 1fr));
    gap: 40px;
    max-width: 1500px;
    margin: 0 auto;
    position: relative;
    z-index: 3;
  }

  .objective-card {
    background: 
      linear-gradient(135deg, rgba(0, 0, 0, 0.3), rgba(255, 255, 255, 0.02)),
      radial-gradient(circle at center, rgba(255, 255, 255, 0.03) 0%, transparent 70%);
    backdrop-filter: blur(15px);
    padding: 40px 30px;
    border-radius: 0;
    position: relative;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    border: 1px solid rgba(255, 255, 255, 0.08);
    clip-path: polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px));
  }

  .objective-card:hover {
    transform: scale(1.02) translateY(-5px);
    border-color: rgba(255, 255, 255, 0.15);
    box-shadow: 
      0 20px 40px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.08);
    background: 
      linear-gradient(135deg, rgba(0, 0, 0, 0.4), rgba(255, 255, 255, 0.04)),
      radial-gradient(circle at center, rgba(0, 212, 255, 0.04) 0%, transparent 70%);
  }

  .card-frame {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
  }

  .corner {
    position: absolute;
    width: 12px;
    height: 12px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease;
  }

  .objective-card:hover .corner {
    border-color: rgba(0, 212, 255, 0.4);
    width: 16px;
    height: 16px;
  }

  .corner.top-left {
    top: 8px;
    left: 8px;
    border-right: none;
    border-bottom: none;
  }

  .corner.top-right {
    top: 8px;
    right: 8px;
    border-left: none;
    border-bottom: none;
  }

  .corner.bottom-left {
    bottom: 8px;
    left: 8px;
    border-right: none;
    border-top: none;
  }

  .corner.bottom-right {
    bottom: 8px;
    right: 8px;
    border-left: none;
    border-top: none;
  }

  .icon-chamber {
    width: 80px;
    height: 80px;
    margin: 0 auto 30px;
    background: 
      radial-gradient(circle, rgba(255, 255, 255, 0.04) 0%, transparent 70%),
      linear-gradient(135deg, rgba(0, 0, 0, 0.3), rgba(255, 255, 255, 0.02));
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.85);
    position: relative;
    transition: all 0.4s ease;
  }

  .geospatial .icon-chamber {
    background: 
      radial-gradient(circle, rgba(0, 212, 255, 0.06) 0%, transparent 70%),
      linear-gradient(135deg, rgba(0, 0, 0, 0.3), rgba(0, 212, 255, 0.02));
    border-color: rgba(0, 212, 255, 0.15);
    color: rgba(0, 212, 255, 0.9);
  }

  .comprehensive .icon-chamber {
    background: 
      radial-gradient(circle, rgba(255, 107, 0, 0.05) 0%, transparent 70%),
      linear-gradient(135deg, rgba(0, 0, 0, 0.3), rgba(255, 107, 0, 0.02));
    border-color: rgba(255, 107, 0, 0.15);
    color: rgba(255, 107, 0, 0.85);
  }

  .energy-ring {
    position: absolute;
    top: -6px;
    left: -6px;
    right: -6px;
    bottom: -6px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 50%;
    animation: energy-pulse 3s ease-in-out infinite;
  }

  .objective-card:hover .icon-chamber {
    transform: scale(1.05);
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
  }

  .data-block {
    text-align: center;
  }

  .objective-title {
    font-size: 1.7rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.95);
    margin-bottom: 15px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    letter-spacing: 0.5px;
  }

  .title-underline {
    width: 40px;
    height: 2px;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0.4), rgba(0, 212, 255, 0.4));
    margin: 15px auto 25px;
    animation: underline-glow 4s ease-in-out infinite;
  }

  .objective-desc {
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.6;
    font-size: 1.05rem;
    font-weight: 300;
    letter-spacing: 0.3px;
  }

  @keyframes grid-shift {
    0% { transform: translate(0, 0); }
    100% { transform: translate(80px, 80px); }
  }

  @keyframes particle-float {
    0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
    15% { opacity: 1; }
    85% { opacity: 1; }
    100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
  }

  @keyframes pulse-ring {
    0% { transform: translate(-50%, -50%) scale(0.9); opacity: 0.6; }
    100% { transform: translate(-50%, -50%) scale(1.3); opacity: 0; }
  }

  @keyframes hexagon-rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes cyber-glow {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }

  @keyframes data-flow {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }

  @keyframes energy-pulse {
    0%, 100% { transform: scale(1); opacity: 0.3; }
    50% { transform: scale(1.03); opacity: 0.6; }
  }

  @keyframes underline-glow {
    0%, 100% { box-shadow: 0 0 3px rgba(255, 255, 255, 0.1); }
    50% { box-shadow: 0 0 8px rgba(0, 212, 255, 0.3); }
  }
</style>