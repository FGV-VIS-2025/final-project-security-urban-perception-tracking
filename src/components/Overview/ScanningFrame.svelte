<script>
  import WorldsIcon from "../../lib/Icons/WorldsIcon.svelte";
  import { base } from '$app/paths';

</script>

<a href={`${base}/map`}  class="tooltip-container">
  <div class="hero-visual">
    <div class="scanning-frame">
      <div class="scan-line"></div>
      <div class="corner-brackets">
        <div class="bracket top-left"></div>
        <div class="bracket top-right"></div>
        <div class="bracket bottom-left"></div>
        <div class="bracket bottom-right"></div>
      </div>
    </div>
  
    <div class="pulsing-circle">
      <div class="radar-sweep"></div>
      <div class="inner-circle">
        <WorldsIcon color={"#00d4ff"} size={70} />
      </div>
      <div class="orbit-ring ring-1"></div>
      <div class="orbit-ring ring-2"></div>
    </div>
  </div>
  <span class="tooltip">Direct to MapInteractive</span>
</a>

<style>
  .hero-visual {
    flex: 0 0 400px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    z-index: 2;
    cursor: pointer;
  }
  
  .tooltip-container {
    position: relative;
    display: inline-block;
  }

  .tooltip {
    visibility: hidden;
    width: auto;
    background-color: rgba(0, 0, 0, 0.7);
    color: #00d4ff;
    text-align: center;
    border-radius: 6px;
    padding: 5px 10px;
    position: absolute;
    z-index: 10;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-bottom: 10px;
    font-size: 14px;
    opacity: 0;
    transition: opacity 0.3s;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(0, 212, 255, 0.5);
  }

  .tooltip-container:hover .tooltip {
    visibility: visible;
    opacity: 1;
  }

  .scanning-frame {
    position: absolute;
    width: 350px;
    height: 350px;
    border: 2px solid rgba(0, 212, 255, 0.3);
    border-radius: 20px;
    z-index: 3;
  }

  .scan-line {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, #00d4ff, transparent);
    animation: scan 3s linear infinite;
  }

  .corner-brackets {
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
  }

  .bracket {
    position: absolute;
    width: 35px;
    height: 35px;
    border: 3px solid #ff6b00;
  }

  .bracket.top-left {
    top: 0;
    left: 0;
    border-right: none;
    border-bottom: none;
  }

  .bracket.top-right {
    top: 0;
    right: 0;
    border-left: none;
    border-bottom: none;
  }

  .bracket.bottom-left {
    bottom: 0;
    left: 0;
    border-right: none;
    border-top: none;
  }

  .bracket.bottom-right {
    bottom: 0;
    right: 0;
    border-left: none;
    border-top: none;
  }

  .pulsing-circle {
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(0, 212, 255, 0.1) 0%,
      rgba(0, 212, 255, 0.05) 50%,
      transparent 100%
    );
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    animation: float 6s ease-in-out infinite;
  }

  .radar-sweep {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: conic-gradient(
      from 0deg,
      transparent 0deg,
      rgba(0, 212, 255, 0.3) 60deg,
      transparent 120deg
    );
    animation: radar 3s linear infinite;
  }

  .inner-circle {
    width: 160px;
    height: 160px;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(0, 212, 255, 0.2) 0%,
      rgba(0, 0, 0, 0.8) 100%
    );
    border: 2px solid rgba(0, 212, 255, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 2;
    backdrop-filter: blur(10px);
  }

  .orbit-ring {
    position: absolute;
    border: 1px solid rgba(0, 212, 255, 0.2);
    border-radius: 50%;
    animation: rotate 20s linear infinite;
  }

  .ring-1 {
    width: 330px;
    height: 330px;
    border-style: dashed;
  }

  .ring-2 {
    width: 370px;
    height: 370px;
    animation-duration: 30s;
    animation-direction: reverse;
  }

  @keyframes sweep {
    0%, 100% { transform: translateX(-100%); }
    50% { transform: translateX(100%); }
  }

  @keyframes scan {
    0% { transform: translateY(0); }
    100% { transform: translateY(350px); }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }

  @keyframes radar {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>
