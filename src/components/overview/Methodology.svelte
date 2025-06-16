<script>
  import Team from "../../lib/Icons/Team.svelte"
  import ClockIcon from "../../lib/Icons/ClockIcon2.svelte"
  import ChartIcon from "../../lib/Icons/ChartIcon2.svelte"
  import PictureIcon from "../../lib/Icons/PictureIcon.svelte"
  let expandedSection = null;

  function toggleSection(section) {
    expandedSection = expandedSection === section ? null : section;
  }
</script>

<section class="methodology-section">
  <div class="methodology-container">
    <div class="methodology-hero">
      <div class="hero-badge">
        <span class="badge-text">URBAN PERCEPTION RESEARCH</span>
      </div>
      <h1 class="hero-title">Understanding Urban Security</h1>
    </div>

    <!-- Problem Statement -->
    <div class="problem-statement">
      <div class="problem-icon">⚠️</div>
      <div class="problem-content">
        <h3>What aspect of urban security do we want to communicate?</h3>
        <p>
          This research seeks to quantify how citizens perceive security in
          different urban spaces in Rio de Janeiro, identifying visual patterns
          that influence the feeling of security or insecurity in the urban
          environment.
        </p>
      </div>
    </div>

    <!-- Methodology Steps -->
    <div class="methodology-flow">
      <h2 class="flow-title">Research Methodology</h2>

      <div class="flow-steps horizontal">
        <div class="flow-step" class:expanded={expandedSection === "selection"}>
          <div class="step-header" on:click={() => toggleSection("selection")}>
            <div class="step-number">01</div>
            <div class="step-info">
              <h4>Selection of Participants</h4>
              <p>30 university students from Rio de Janeiro</p>
            </div>
            <div class="expand-icon">
              {expandedSection === "selection" ? "-" : "+"}
            </div>
          </div>

          {#if expandedSection === "selection"}
            <div class="step-details">
              <div class="detail-item">
                <strong>Selection criteria:</strong> FGV students 
              </div>
            </div>
          {/if}
        </div>

        <div class="flow-arrow horizontal-arrow">→</div>

        <div class="flow-step" class:expanded={expandedSection === "protocol"}>
          <div class="step-header" on:click={() => toggleSection("protocol")}>
            <div class="step-number">02</div>
            <div class="step-info">
              <h4>Observation Protocol</h4>
              <p>50 images × 15 seconds each</p>
            </div>
            <div class="expand-icon">
              {expandedSection === "protocol" ? "-" : "+"}
            </div>
          </div>

          {#if expandedSection === "protocol"}
            <div class="step-details">
              <div class="detail-item">
                <strong>Image type:</strong> Photographs of public spaces and streets
                in Rio de Janeiro
              </div>
              <div class="detail-item">
                <strong>Exposure time:</strong> 15 seconds per image to capture the
                first impression
              </div>
            </div>
          {/if}
        </div>

        <div class="flow-arrow horizontal-arrow">→</div>

        <div class="flow-step" class:expanded={expandedSection === "evaluation"}>
          <div class="step-header" on:click={() => toggleSection("evaluation")}>
            <div class="step-number">03</div>
            <div class="step-info">
              <h4>Security Assessment</h4>
              <p>Scale of 1-10 (unsafe → safe)</p>
            </div>
            <div class="expand-icon">
              {expandedSection === "evaluation" ? "-" : "+"}
            </div>
          </div>

          {#if expandedSection === "evaluation"}
            <div class="step-details">
              <div class="detail-item">
                <strong>Key Question:</strong> "How safe would you feel walking through
                this location?"
              </div>
            </div>
          {/if}
        </div>
      </div>
    </div>

    <div class="data-overview">
      <h3>Research Data</h3>
      <div class="data-grid">
        <div class="data-card participants">
          <div class="data-icon"><Team size={35}/></div>
          <div class="data-info">
            <span class="data-number">30</span>
            <span class="data-label">Participants</span>
            <span class="data-sublabel">University students</span>
          </div>
        </div>

        <div class="data-card images">
          <div class="data-icon"><PictureIcon size={35}/></div>
          <div class="data-info">
            <span class="data-number">50</span>
            <span class="data-label">Images</span>
            <span class="data-sublabel">RJ urban spaces</span>
          </div>
        </div>

        <div class="data-card time">
          <div class="data-icon"><ClockIcon size={35}/></div>
          <div class="data-info">
            <span class="data-number">15</span>
            <span class="data-label">Seconds</span>
            <span class="data-sublabel">By evaluation</span>
          </div>
        </div>

        <div class="data-card total">
          <div class="data-icon"><ChartIcon size={35}/></div>
          <div class="data-info">
            <span class="data-number">1,500</span>
            <span class="data-label">Evaluations</span>
            <span class="data-sublabel">Total Data</span>
          </div>
        </div>
      </div>
    </div>

    <div class="place-pulse-connection">
      <div class="connection-content">
        <h4>Inspired by Place Pulse (MIT)</h4>
        <p>
          This methodology is based on MIT's Place Pulse project, which uses
          crowdsourcing to map large-scale urban perceptions. Our study adapts
          this methodology to the specific context of Rio de Janeiro, focusing
          on the perception of urban safety.
        </p>
      </div>
    </div>
  </div>
</section>

<style>
  .methodology-section {
    background: linear-gradient(
      45deg,
      rgba(15, 23, 42, 0.95) 0%,
      rgba(30, 41, 59, 0.92) 50%,
      rgba(51, 65, 85, 0.9) 100%
    );
    box-shadow:
      0 0 50px rgba(0, 212, 255, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    padding: 60px 40px;
    color: white;
    position: relative;
    overflow: hidden;
  }

  .methodology-container {
    max-width: 1200px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }

  .methodology-hero {
    text-align: center;
    margin-bottom: 60px;
  }

  .hero-badge {
    background: linear-gradient(90deg, #dc2626, #ea580c);
    display: inline-block;
    padding: 8px 24px;
    border-radius: 20px;
    margin-bottom: 20px;
    font-size: 0.85rem;
    font-weight: 600;
    letter-spacing: 0.5px;
    box-shadow: 0 4px 15px rgba(220, 38, 38, 0.3);
  }

  .hero-title {
    font-size: 3rem;
    font-weight: 800;
    margin-bottom: 16px;
    background: linear-gradient(135deg, #ffffff, #cbd5e1);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1.1;
  }

  .problem-statement {
    background: rgba(245, 158, 11, 0.1);
    border: 1px solid rgba(245, 158, 11, 0.2);
    border-radius: 16px;
    padding: 30px;
    margin-bottom: 50px;
    display: flex;
    align-items: flex-start;
    gap: 20px;
  }

  .problem-icon {
    font-size: 2rem;
    flex-shrink: 0;
  }

  .problem-content h3 {
    color: #f59e0b;
    margin-bottom: 12px;
    font-size: 1.3rem;
    font-weight: 600;
  }

  .problem-content p {
    color: #cbd5e1;
    line-height: 1.6;
    margin: 0;
  }

  .methodology-flow {
    margin-bottom: 50px;
  }

  .flow-title {
    text-align: center;
    font-size: 2.2rem;
    font-weight: 700;
    margin-bottom: 40px;
    color: white;
  }

  .flow-steps {
    display: flex;
    flex-direction: column;
    gap: 20px;
    max-width: 800px;
    margin: 0 auto;
  }

  .flow-steps.horizontal {
    flex-direction: row;
    align-items: flex-start;
    max-width: 100%;
    gap: 15px;
  }

  .flow-steps.horizontal .flow-step {
    flex: 1;
    min-width: 280px;
  }

  .horizontal-arrow {
    align-self: center;
    margin-top: 30px;
    font-size: 1.8rem;
    color: #7c3aed;
    font-weight: bold;
  }

  .flow-step {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    overflow: hidden;
    transition: all 0.3s ease;
  }

  .flow-step:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(124, 58, 237, 0.3);
  }

  .flow-step.expanded {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(124, 58, 237, 0.5);
  }

  .step-header {
    display: flex;
    align-items: center;
    padding: 25px 20px;
    cursor: pointer;
    gap: 15px;
  }

  .step-number {
    width: 45px;
    height: 45px;
    background: #1d2237;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 1rem;
    flex-shrink: 0;
  }

  .step-info {
    flex: 1;
  }

  .step-info h4 {
    margin: 0 0 5px 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: white;
  }

  .step-info p {
    margin: 0;
    color: #94a3b8;
    font-size: 0.9rem;
  }

  .expand-icon {
    font-size: 1.5rem;
    font-weight: bold;
    color: #64748b;
    transition: transform 0.3s ease;
  }

  .flow-step.expanded .expand-icon {
    transform: rotate(180deg);
  }

  .step-details {
    padding: 0 20px 25px 80px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .detail-item {
    color: #cbd5e1;
    font-size: 0.85rem;
    line-height: 1.5;
  }

  .detail-item strong {
    color: #f59e0b;
  }

  .flow-arrow {
    text-align: center;
    font-size: 1.5rem;
    color: #475569;
    margin: 10px 0;
  }

  .data-overview {
    margin-bottom: 50px;
  }

  .data-overview h3 {
    text-align: center;
    font-size: 1.8rem;
    font-weight: 700;
    margin-bottom: 30px;
    color: white;
  }

  .data-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
  }

  .data-card {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 25px;
    display: flex;
    align-items: center;
    gap: 15px;
    transition: all 0.3s ease;
  }

  .data-card:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateY(-2px);
  }

  .data-card.participants:hover {
    border-color: rgba(124, 58, 237, 0.5);
  }
  .data-card.images:hover {
    border-color: rgba(6, 182, 212, 0.5);
  }
  .data-card.time:hover {
    border-color: rgba(245, 158, 11, 0.5);
  }
  .data-card.total:hover {
    border-color: rgba(245, 158, 11, 0.5);
  }

  .data-icon {
    font-size: 2rem;
    flex-shrink: 0;
  }

  .data-info {
    display: flex;
    flex-direction: column;
  }

  .data-number {
    font-size: 2.2rem;
    font-weight: 800;
    color: white;
    line-height: 1;
  }

  .data-label {
    color: #94a3b8;
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 2px;
  }

  .data-sublabel {
    color: #64748b;
    font-size: 0.8rem;
  }

  .place-pulse-connection {
    border-radius: 16px;
    padding: 30px;
    text-align: center;
  }

  .connection-content h4 {
    color: #a5b4fc;
    margin-bottom: 15px;
    font-size: 1.3rem;
    font-weight: 600;
  }

  .connection-content p {
    color: #cbd5e1;
    line-height: 1.6;
    margin: 0;
    max-width: 700px;
    margin: 0 auto;
  }
</style>