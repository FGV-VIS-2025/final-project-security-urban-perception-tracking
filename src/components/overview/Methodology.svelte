<script>
  import ClockIcon from "../../lib/Icons/ClockIcon.svelte";
  import FeatureIcon from "../../lib/Icons/FeatureIcon.svelte";
  import PictureIcon from "../../lib/Icons/PictureIcon.svelte";
  import UserIcon from "../../lib/Icons/UserIcon.svelte";
</script>

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

<style>
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

  .methodology-flow {
    flex-direction: column;
  }

  .flow-arrow {
    transform: rotate(90deg);
  }
</style>
