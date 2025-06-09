<script>
  import Arrow from "../../lib/Icons/Arrow.svelte";
  import PictureIcon from "../../lib/Icons/PictureIcon.svelte";
  import UserIcon from "../../lib/Icons/UserIcon.svelte";
  import ScanningFrame from "./ScanningFrame.svelte";
</script>

<section class="hero-section">
  <div class="background-overlay"></div>
  <div class="noise-texture"></div>
  
  <img src="/hololens.webp" alt="hololens" class="hero-image" />
  
  <div class="hero-content">    
    <h1 class="hero-title">
      <span class="title-gradient">SECURITY URBAN</span>
      <span class="title-gradient secondary">PERCEPTION TRACKING</span>
      <span class="title-secondary">Eye Tracking • Rio de Janeiro</span>
    </h1>
    
    <div class="hero-stats">
      <div class="stat-bubble">
        <div class="stat-icon">
          <UserIcon size={24} />
        </div>  
        <div class="stat-content">
          <span class="stat-number">30</span>
          <span class="stat-label">Participants</span>
        </div>
      </div>
      <div class="stat-bubble">
        <div class="stat-icon">
          <PictureIcon size={24} />
        </div>
        <div class="stat-content">
          <span class="stat-number">1,500</span>
          <span class="stat-label">Observations</span>
        </div>
      </div>
    </div>
    
    <Arrow/>
  </div>

  <ScanningFrame/>
</section>

<style>
  .hero-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 120px 80px;
    min-height: 100vh;
    position: relative;
    overflow: hidden;
    background: 
      radial-gradient(circle at 20% 80%, rgba(0, 212, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 107, 0, 0.08) 0%, transparent 50%),
      linear-gradient(135deg, #0a0a15 0%, #1a1a2e 50%, #16213e 100%);
    box-shadow: 
      0 0 50px rgba(0, 212, 255, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }

  .background-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      linear-gradient(45deg, transparent 30%, rgba(0, 212, 255, 0.02) 50%, transparent 70%);
    animation: sweep 8s ease-in-out infinite;
    pointer-events: none;
  }

  .noise-texture {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0.03;
    background-image: 
      radial-gradient(circle, #fff 1px, transparent 1px);
    background-size: 20px 20px;
    animation: noise 0.5s infinite linear;
    pointer-events: none;
  }

  .hero-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.05;
    filter: contrast(1.2) brightness(0.7);
    z-index: 1;
  }

  .hero-content {
    flex: 1;
    max-width: 700px;
    z-index: 2;
    position: relative;
  }

  .hero-title {
    margin: 0 0 50px 0;
    line-height: 1.1;
  }

  .title-gradient {
    display: block;
    font-size: 4.8rem;
    font-weight: 900;
    background: linear-gradient(
      135deg, 
      #ffffff 0%, 
      #00d4ff 30%, 
      #ffffff 60%, 
      #ff6b00 100%
    );
    background-size: 200% 200%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 4s ease-in-out infinite;
    text-shadow: 0 0 30px rgba(0, 212, 255, 0.3);
  }

  .title-gradient.secondary {
    font-size: 4.4rem;
    margin-top: -10px;
  }

  .title-secondary {
    display: block;
    font-size: 1.8rem;
    color: rgba(255, 255, 255, 0.7);
    font-weight: 300;
    margin-top: 25px;
    text-transform: uppercase;
    letter-spacing: 2px;
  }

  .hero-stats {
    display: flex;
    gap: 25px;
    flex-wrap: wrap;
    margin-bottom: 50px;
  }

  .stat-bubble {
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(20px);
    padding: 25px 30px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    gap: 18px;
    border: 1px solid rgba(0, 212, 255, 0.2);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
  }

  .stat-bubble::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.1), transparent);
    transition: left 0.6s;
  }

  .stat-bubble:hover::before {
    left: 100%;
  }

  .stat-bubble:hover {
    transform: translateY(-8px) scale(1.05);
    border-color: rgba(0, 212, 255, 0.5);
    box-shadow: 0 20px 40px rgba(0, 212, 255, 0.2);
  }

  .stat-icon {
    width: 55px;
    height: 55px;
    background: rgba(0, 212, 255, 0.1);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #00d4ff;
    border: 1px solid rgba(0, 212, 255, 0.3);
  }

  .stat-content {
    display: flex;
    flex-direction: column;
  }

  .stat-number {
    font-size: 2rem;
    font-weight: 700;
    color: #ffffff;
    line-height: 1;
  }

  .stat-label {
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.6);
    font-weight: 400;
  }

  @keyframes shimmer {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }

  @keyframes pulse-dot {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(1.2); }
  }

  @keyframes sweep {
    0%, 100% { transform: translateX(-100%); }
    50% { transform: translateX(100%); }
  }

  @keyframes noise {
    0%, 100% { transform: translate(0, 0); }
    10% { transform: translate(-5%, -5%); }
    20% { transform: translate(-10%, 5%); }
    30% { transform: translate(5%, -10%); }
    40% { transform: translate(-5%, 15%); }
    50% { transform: translate(-10%, 5%); }
    60% { transform: translate(15%, 0%); }
    70% { transform: translate(0%, 15%); }
    80% { transform: translate(-15%, 10%); }
    90% { transform: translate(10%, 5%); }
  }

  @keyframes scan {
    0% { transform: translateY(0); }
    100% { transform: translateY(350px); }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }
</style>