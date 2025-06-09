<script>
  function scrollToObjectives() {
    const objectivesElement = document.getElementById('objectives-section');
    if (objectivesElement) {
      objectivesElement.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }
</script>

<div class="nav-arrows" on:click={scrollToObjectives}>
  <div class="arrow-container">
    <svg class="arrow" viewBox="0 0 24 24" fill="none">
      <path
        d="M7 10L12 15L17 10"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
    <svg class="arrow arrow-delayed" viewBox="0 0 24 24" fill="none">
      <path
        d="M7 10L12 15L17 10"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
    <svg class="arrow arrow-delayed-2" viewBox="0 0 24 24" fill="none">
      <path
        d="M7 10L12 15L17 10"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </div>
</div>

<style>
  .nav-arrows {
    display: flex;
    justify-content: center;
    margin-top: 40px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .nav-arrows:hover {
    transform: translateY(-5px);
  }

  .arrow-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: -8px;
  }

  .arrow {
    width: 32px;
    height: 32px;
    color: rgba(0, 212, 255, 0.8);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    filter: drop-shadow(0 0 8px rgba(0, 212, 255, 0.3));
    animation: bounce 2s ease-in-out infinite;
  }

  .arrow-delayed {
    animation-delay: 0.2s;
    color: rgba(0, 212, 255, 0.6);
  }

  .arrow-delayed-2 {
    animation-delay: 0.4s;
    color: rgba(0, 212, 255, 0.4);
  }

  .nav-arrows:hover .arrow {
    color: #00d4ff;
    filter: drop-shadow(0 0 15px rgba(0, 212, 255, 0.6));
    transform: scale(1.1);
  }

  .nav-arrows:hover .arrow-delayed {
    color: rgba(0, 212, 255, 0.9);
  }

  .nav-arrows:hover .arrow-delayed-2 {
    color: rgba(0, 212, 255, 0.7);
  }

  @keyframes bounce {
    0%, 100% { 
      transform: translateY(0px);
      opacity: 1;
    }
    50% { 
      transform: translateY(-8px);
      opacity: 0.7;
    }
  }
</style>
