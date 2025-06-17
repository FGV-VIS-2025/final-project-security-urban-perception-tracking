<script>
  import { onMount } from "svelte";
  import Relation from "../../lib/Icons/Relation.svelte";
  import ChordDiagram from "./ChordDiagram.svelte"
  import Unselect from "../../lib/Icons/Unselect.svelte"
  import Information from "../../lib/Icons/Information.svelte"

  export let data = [];
  export let selectedPointId = null;

  let mounted = false;
  let data_plot = null;
  let selectedParticipant = null;
  let hoveredParticipant = null;
  let tooltipPosition = { x: 0, y: 0 };
  let showTooltip = false;

  $: if (mounted && data && data.length > 0 && selectedPointId !== null) {
    data_plot = data[selectedPointId - 1]?.score_participants;
  }

  onMount(() => {
    mounted = true;
  });

  function handleParticipantClick(participant) {
    selectedParticipant = selectedParticipant === participant.participant ? null : participant.participant;
  }

  function handleMouseEnter(event, participant) {
    hoveredParticipant = participant;
    const rect = event.target.getBoundingClientRect();
    tooltipPosition = {
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    };
  }

  function handleMouseLeave() {
    hoveredParticipant = null;
  }
</script>

<div class="card additional-section">
  <div class="additional-header">
    <div class="additional-icon">
      <Relation />
    </div>
    <div class="additional-title">Similarity between Participants</div>
    
    <div class="info-icon-container">
      <div class="info-icon" 
           on:mouseenter={() => showTooltip = true}
           on:mouseleave={() => showTooltip = false}>
        <Information color={"black"}/>
      </div>
      
      {#if showTooltip}
        <div class="info-tooltip">
          <div class="tooltip-content">
            <h4>Participant Similarity Analysis</h4>
            <p><strong>Experiment:</strong> 30 students, 50 random images each from 150 total</p>
            <p><strong>Jaccard Similarity:</strong> |A ∩ B| / |A ∪ B|</p>
            <p>• A ∩ B = Shared images between participants<br>• A ∪ B = Total unique images viewed by both</p>
            
            <div class="behavioral-patterns">
              <p><strong>Visualization:</strong></p>
              <p>• Chord thickness = similarity strength</p>
              <p>• Click participants to explore connections</p>
              <p>• Reveals visual exploration patterns</p>
            </div>
          </div>
        </div>
      {/if}
    </div>
  </div>

  <div class="additional-content">
    <div class="participants-section">
      {#if data_plot && data_plot.length > 0}
        <div class="participants-grid">
          {#each data_plot as participant}
            <div 
              class="participant-square {selectedParticipant === participant.participant ? 'selected' : ''}"
              on:click={() => handleParticipantClick(participant)}
              on:mouseenter={(e) => handleMouseEnter(e, participant)}
              on:mouseleave={handleMouseLeave}
              role="button"
              tabindex="0"
            >
            <div class="participant-number">#{participant.participant}</div>
            <div class="participant-score">{participant.score}</div>
            </div>
          {/each}
        </div>
      {:else}
        <div class="no-data">
          <div class="placeholder-subtext"><Unselect color={"black"}/> Select a point on the map to view participant scores</div>
        </div>
      {/if}
    </div>

    <div class="modern-separator">
      <div class="separator-line"></div>
      <div class="separator-dot"></div>
      <div class="separator-line"></div>
    </div>

    <ChordDiagram selectedParticipant={selectedParticipant}/>
  </div>
</div>

{#if hoveredParticipant}
  <div 
    class="tooltip"
    style="left: {tooltipPosition.x}px; top: {tooltipPosition.y}px;"
  >
    <div class="tooltip-content">
      <div class="tooltip-title">Participant {hoveredParticipant.participant}</div>
      <div class="tooltip-info">Score: {hoveredParticipant.score}</div>
      <div class="tooltip-info">State: {hoveredParticipant.state}</div>
      <div class="tooltip-info">Age: {hoveredParticipant.age}</div>
      <div class="tooltip-info">Gender: {hoveredParticipant.gener}</div>
    </div>
  </div>
{/if}

<style>
  .card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 20px;
    padding: 0.5rem;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .additional-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    position: relative;
  }

  .additional-icon {
    width: 2.25rem;
    height: 2.25rem;
    background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
    border-radius: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }

  .additional-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #2d3748;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  .info-icon-container {
    position: relative;
    margin-left: auto;
  }

  .info-icon {
    width: 1.5rem;
    height: 1.5rem;
    background: rgba(59, 130, 246, 0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid rgba(59, 130, 246, 0.2);
  }

  .info-icon:hover {
    background: rgba(59, 130, 246, 0.2);
    transform: scale(1.1);
  }

  .info-tooltip {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 0.5rem;
    z-index: 1000;
    pointer-events: none;
  }

  .info-tooltip .tooltip-content {
    background: rgba(15, 23, 42, 0.95);
    backdrop-filter: blur(12px);
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.1);
    min-width: 280px;
    max-width: 320px;
  }

  .info-tooltip h4 {
    font-size: 0.875rem;
    font-weight: 600;
    color: #3b82f6;
    margin: 0 0 0.75rem 0;
    border-bottom: 1px solid rgba(59, 130, 246, 0.3);
    padding-bottom: 0.5rem;
  }

  .info-tooltip p {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.9);
    margin: 0 0 0.5rem 0;
    line-height: 1.4;
  }

  .info-tooltip p:last-child {
    margin-bottom: 0;
  }

  .behavioral-patterns {
    margin-top: 0.75rem;
    padding-top: 0.75rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  .behavioral-patterns p {
    margin-bottom: 0.5rem;
  }

  .additional-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  .participants-section {
    min-height: auto;
  }

  .participants-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    justify-content: center;
  }

  .participant-square {
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
    border: 2px solid transparent;
    position: relative;
  }

  .participant-square:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(59, 130, 246, 0.4);
    background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  }

  .participant-square.selected {
    background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
    border-color: #fbbf24;
    box-shadow: 0 4px 16px rgba(251, 191, 36, 0.5);
  }

  .participant-number {
    font-size: 0.5rem;
    font-weight: 700;
    color: white;
    line-height: 1;
  }

  .participant-score {
    font-size: 0.625rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.9);
    line-height: 1;
  }

  .no-data {
    height: 100%;
  }

  .placeholder-subtext {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0px 10px;
    font-size: 0.75rem;
    color: red;
    text-align: center;
  }

  .modern-separator {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .separator-line {
    height: 1px;
    background: linear-gradient(90deg, transparent, #3b82f6, transparent);
    flex: 1;
    max-width: 260px;
  }

  .separator-dot {
    width: 5px;
    height: 5px;
    background: #3b82f6;
    border-radius: 50%;
    margin: 0 12px;
    box-shadow: 0 0 8px rgba(59, 130, 246, 0.5);
  }  

  .tooltip {
    position: fixed;
    z-index: 1000;
    pointer-events: none;
    transform: translateX(-50%) translateY(-100%);
  }

  .tooltip-content {
    background: rgba(15, 23, 42, 0.95);
    backdrop-filter: blur(12px);
    border-radius: 8px;
    padding: 0.75rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.1);
    min-width: 160px;
  }

  .tooltip-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: white;
    margin-bottom: 0.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    padding-bottom: 0.25rem;
  }

  .tooltip-info {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 0.25rem;
  }

  .tooltip-info:last-child {
    margin-bottom: 0;
  }
</style>