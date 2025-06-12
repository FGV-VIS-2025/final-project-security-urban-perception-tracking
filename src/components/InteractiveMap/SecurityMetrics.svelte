<script>
  import { onMount } from "svelte";
  import { currentImage } from "../../stores/appStore";
  import { base } from "$app/paths";
  import { selectedMapPoint } from '../../stores/appStore.js';

  let surveyData = {};
  let selectedPointData = null;
  let error = null;
  let currentPointId = 1;

  currentImage.subscribe((value) => {
    currentPointId = value;
    updateSelectedPointData();
  });

  onMount(async () => {
    await loadSurveyData();
  });

  async function loadSurveyData() {
    try {
      const response = await fetch(base + "/cross.json");
      if (response.ok) {
        surveyData = await response.json();
        updateSelectedPointData();
      }
    } catch (err) {
      error = err.message;
      surveyData = {
        "3": [
          { score: 7, participant: 1, state: "PE/Brasil", age: 22, gener: "H" },
          { score: 7, participant: 6, state: "RS/Brasil", age: 22, gener: "M" },
        ],
        "4": [
          { score: 7, participant: 1, state: "PE/Brasil", age: 22, gener: "H" },
          { score: 5, participant: 5, state: "Peru", age: 25, gener: "H" },
        ],
      };
      updateSelectedPointData();
    }
  }

  $: if ($selectedMapPoint) {
    currentPointId = $selectedMapPoint.id; // Usa el ID del punto seleccionadoo
    updateSelectedPointData();
  }

  function updateSelectedPointData() {
    // Map point ID corresponds to JSON key (point 3 = key "4")
    const jsonKey = (currentPointId + 1).toString();
    selectedPointData = surveyData[jsonKey] || null;
  }

  function getAverageScore(data) {
    if (!data || data.length === 0) return 0;
    const total = data.reduce((sum, item) => sum + item.score, 0);
    return (total / data.length).toFixed(1);
  }

  function getGenderDistribution(data) {
    if (!data || data.length === 0) return { H: 0, M: 0 };
    return data.reduce((acc, item) => {
      acc[item.gener] = (acc[item.gener] || 0) + 1;
      return acc;
    }, {});
  }

  function getAgeDistribution(data) {
    if (!data || data.length === 0) return {};
    return data.reduce((acc, item) => {
      const ageGroup =
        item.age < 25 ? "18-24" : item.age < 35 ? "25-34" : "35+";
      acc[ageGroup] = (acc[ageGroup] || 0) + 1;
      return acc;
    }, {});
  }

  function getStateDistribution(data) {
    if (!data || data.length === 0) return {};
    return data.reduce((acc, item) => {
      acc[item.state] = (acc[item.state] || 0) + 1;
      return acc;
    }, {});
  }

  function getScoreColor(score) {
    if (score >= 7) return "#4CAF50";
    if (score >= 5) return "#FFC107";
    return "#F44336";
  }
</script>

<style>
  .metrics-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: hidden;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .no-data-icon {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }

  .current-point {
    flex: 1;
    overflow-y: auto;
  }

  .current-point h3 {
    margin: 0 0 1rem 0;
    color: #fff;
    font-size: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .point-stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .stat-card {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 1rem;
    text-align: center;
    position: relative;
    overflow: hidden;
  }

  .stat-card.primary {
    background: linear-gradient(
      135deg,
      rgba(102, 126, 234, 0.2),
      rgba(118, 75, 162, 0.2)
    );
    border-color: rgba(102, 126, 234, 0.3);
  }

  .stat-value {
    font-size: 1.8rem;
    font-weight: 700;
    color: #fff;
    margin-bottom: 0.25rem;
  }

  .stat-label {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.7);
  }

  .stat-indicator {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
  }

  .distributions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .distribution-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 8px;
    padding: 1rem;
  }

  .distribution-card h4 {
    margin: 0 0 0.75rem 0;
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.9);
  }

  .distribution-bars {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .bar-item {
    display: grid;
    grid-template-columns: 60px 1fr 30px;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8rem;
  }

  .bar-label {
    color: rgba(255, 255, 255, 0.8);
  }

  .bar-container {
    background: rgba(255, 255, 255, 0.1);
    height: 4px;
    border-radius: 2px;
    overflow: hidden;
  }

  .bar {
    background: linear-gradient(90deg, #667eea, #764ba2);
    height: 100%;
    border-radius: 2px;
    transition: width 0.3s ease;
  }

  .bar-value {
    color: rgba(255, 255, 255, 0.9);
    font-weight: 600;
    text-align: right;
  }

  .scores-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .score-chip {
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 600;
    color: white;
  }

  .participants-list {
    margin-bottom: 1rem;
  }

  .participants-list h4 {
    margin: 0 0 0.75rem 0;
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.9);
  }

  .participants-scroll {
    max-height: 120px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .participant-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 6px;
    padding: 0.75rem;
  }

  .participant-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .participant-id {
    font-weight: 600;
    color: rgba(255, 255, 255, 0.9);
    font-size: 0.8rem;
  }

  .participant-score {
    font-weight: 700;
    font-size: 0.9rem;
  }

  .participant-info {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .info-item {
    font-size: 0.7rem;
    color: rgba(255, 255, 255, 0.6);
  }

  .overview-stats {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: 1rem;
  }

  .overview-stats h4 {
    margin: 0 0 0.75rem 0;
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.9);
  }

  .overview-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .overview-item {
    text-align: center;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 8px;
    padding: 0.75rem;
  }

  .overview-number {
    display: block;
    font-size: 1.2rem;
    font-weight: 700;
    color: #667eea;
    margin-bottom: 0.25rem;
  }

  .overview-label {
    font-size: 0.7rem;
    color: rgba(255, 255, 255, 0.7);
  }

  /* Enhanced scrollbar styling for participants-scroll */
  .participants-scroll::-webkit-scrollbar {
    width: 8px;
  }

  .participants-scroll::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.02);
    border-radius: 10px;
    margin: 6px 0;
    box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.1);
  }

  .participants-scroll::-webkit-scrollbar-thumb {
    background: linear-gradient(
      180deg,
      rgba(102, 126, 234, 0.8) 0%,
      rgba(118, 75, 162, 0.9) 50%,
      rgba(76, 175, 80, 0.7) 100%
    );
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow:
      0 2px 4px rgba(0, 0, 0, 0.2),
      inset 0 1px 2px rgba(255, 255, 255, 0.2);
  }

  .participants-scroll::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(
      180deg,
      rgba(102, 126, 234, 1) 0%,
      rgba(118, 75, 162, 1) 50%,
      rgba(76, 175, 80, 0.9) 100%
    );
    transform: scale(1.1);
    box-shadow:
      0 4px 8px rgba(0, 0, 0, 0.3),
      inset 0 1px 2px rgba(255, 255, 255, 0.3),
      0 0 10px rgba(102, 126, 234, 0.4);
  }

  .participants-scroll::-webkit-scrollbar-thumb:active {
    background: linear-gradient(
      180deg,
      rgba(102, 126, 234, 1) 0%,
      rgba(118, 75, 162, 1) 30%,
      rgba(76, 175, 80, 1) 100%
    );
    transform: scale(0.95);
    box-shadow:
      inset 0 2px 4px rgba(0, 0, 0, 0.3),
      0 1px 2px rgba(0, 0, 0, 0.2);
  }

  .participants-scroll::-webkit-scrollbar-corner {
    background: transparent;
  }

  .participants-scroll {
    scrollbar-width: thin;
    scrollbar-color: rgba(102, 126, 234, 0.8) rgba(255, 255, 255, 0.02);
  }

  .participants-scroll.modern-scroll::-webkit-scrollbar {
    width: 6px;
  }

  .participants-scroll.modern-scroll::-webkit-scrollbar-track {
    background: transparent;
  }

  .participants-scroll.modern-scroll::-webkit-scrollbar-thumb {
    background: rgba(102, 126, 234, 0.6);
    border-radius: 20px;
    border: 2px solid transparent;
    background-clip: content-box;
    transition: all 0.2s ease;
  }

  .participants-scroll.modern-scroll::-webkit-scrollbar-thumb:hover {
    background: rgba(102, 126, 234, 0.9);
    border-radius: 20px;
    background-clip: content-box;
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
  }
</style>
