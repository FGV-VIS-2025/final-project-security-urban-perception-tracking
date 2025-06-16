<script>
  import ArrowTeam from "../../lib/Icons/ArrowTeam.svelte";
  import Github from "../../lib/Icons/Github.svelte";
  import StackTech from "../../lib/Icons/StackTech.svelte";
  import Team from "../../lib/Icons/Team.svelte";

  const teamMembers = [
    {
      id: 1,
      name: "Andres De La Puente Ancco",
      role: "Author",
      avatar:
        "https://media.licdn.com/dms/image/v2/C4D03AQEI9DzmOgSyfQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1516683755961?e=1755734400&v=beta&t=9nvqeoKYj3gUWcWY9qVLgw1ufSsZFTU1ZN484wS9i4E",
      skills: ["Javacript", "Node", "Python", "D3"],
      github: "https://github.com/andresdlp05",
      linkedin: "https://www.linkedin.com/in/vdelapuentea/",
      portfolio: "https://andresdlp05.github.io/portfolio-svelte/",
      experience: "+5 años",
      status: "Coding",
    },
    {
      id: 2,
      name: "Luis Felipe Sante Taipe",
      role: "Collaborator",
      avatar:
        "https://media.licdn.com/dms/image/v2/D4E03AQENrbE9PxyiTg/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1712638895009?e=1755734400&v=beta&t=axIAGt7H-9BPxBWzrwNMxjpcHlx8TD2IN3vgw3pdLpc",
      skills: ["Javacript", "Node", "Python", "D3"],
      github: "https://github.com/LuisSante",
      linkedin:
        "https://www.linkedin.com/in/luis-felipe-sante-taipe-0ba00723b/",
      portfolio: "https://portofolio-artificial-intelligence.vercel.app/",
      experience: "+1 año",
      status: "Coding",
    },
    {
      id: 3,
      name: "Leighton L. Estrada Rayme",
      role: "Collaborator",
      avatar:
        "https://media.licdn.com/dms/image/v2/D4E03AQFzmOCDFoCmUg/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1679869649219?e=1755734400&v=beta&t=LU-NaRYs8rytfl1LZgQm9B6LfibDSrLDpEyq9JkW0lY",
      skills: ["Javacript", "Node", "Python", "D3"],
      github: "https://github.com/Leandr0ER",
      linkedin: "https://www.linkedin.com/in/leighton-estrada/",
      portfolio: "https://leandr0er.github.io/LaboVis09/",
      experience: "+12 años",
      status: "Coding",
    },
  ];

  let selectedMember = null;
  let hoveredMember = null;

  function selectMember(member) {
    selectedMember = selectedMember?.id === member.id ? null : member;
  }

  function openLink(url, event) {
    event.stopPropagation();
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function getStatusColor(status) {
    const colors = {
      coding: "#10b981",
    };
    return colors[status] || "#10b981";
  }

  function getStatusText(status) {
    const texts = {
      coding: "Coding",
    };
    return texts[status] || "Active";
  }
</script>

<div class="team-container">
  <div class="team-grid"></div>
  <div class="team-scanner"></div>

  <div class="team-header">
    <div class="header-content">
      <div class="header-icon"><Team /></div>
      <div class="header-text">
        <h2 class="team-title">Our Team</h2>
        <p class="team-subtitle">The developers behind SUPT - Platform</p>
      </div>
    </div>
  </div>

  <div class="main-layout">
    <div class="members-column">
      {#each teamMembers as member, index}
        <div
          class="member-card"
          class:expanded={selectedMember?.id === member.id}
          class:featured={index === 0}
          on:click={() => selectMember(member)}
          on:mouseenter={() => (hoveredMember = member)}
          on:mouseleave={() => (hoveredMember = null)}
          on:keydown={(e) => e.key === "Enter" && selectMember(member)}
          role="button"
          tabindex="0"
          style="--delay: {index * 0.15}s; --member-color: {getStatusColor(
            member.status
          )}"
        >
          <div class="card-glow"></div>
          <div
            class="status-indicator"
            style="background: {getStatusColor(member.status)}"
          ></div>

          <div class="card-content">
            <div class="member-avatar">
              <div class="avatar-ring"></div>
              <img src={member.avatar} alt={member.name} class="avatar-image" />
              <div class="avatar-badge"></div>
            </div>

            <div class="member-info">
              <h3 class="member-name">{member.name}</h3>
              <p class="member-role">{member.role}</p>
              <div class="member-status">
                <div
                  class="status-dot"
                  style="background: {getStatusColor(member.status)}"
                ></div>
                <span class="status-text">{getStatusText(member.status)}</span>
              </div>
            </div>

            <div class="member-stats">
              <div class="expand-btn">
                <div
                  class="expand-icon"
                  class:rotated={selectedMember?.id === member.id}
                >
                  <ArrowTeam />
                </div>
              </div>
            </div>
          </div>

          {#if selectedMember?.id === member.id}
            <div class="member-details">
              <div class="skills-section">
                <div class="skills-header">
                  <StackTech />
                  <span>Technological Stack</span>
                </div>
                <div class="skills-grid">
                  {#each member.skills as skill}
                    <div class="skill-chip">{skill}</div>
                  {/each}
                </div>
              </div>

              <div class="links-section">
                <div class="links-header">
                  <span>Links</span>
                </div>
                <div class="links-grid">
                  <button
                    class="link-item github-link"
                    on:click={(e) => openLink(member.github, e)}
                    title="Ver perfil de GitHub"
                  >
                    <div class="link-icon">
                      <Github />
                    </div>
                    <div class="link-content">
                      <span class="link-label">GitHub</span>
                      <span class="link-url"
                        >@{member.github.split("/").pop()}</span
                      >
                    </div>
                    <div class="link-arrow">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path d="M7 17L17 7M17 7H7M17 7V17" />
                      </svg>
                    </div>
                  </button>

                  <button
                    class="link-item linkedin-link"
                    on:click={(e) => openLink(member.linkedin, e)}
                    title="Ver perfil de LinkedIn"
                  >
                    <div class="link-icon">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path
                          d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"
                        />
                        <rect x="2" y="9" width="4" height="12" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                    </div>
                    <div class="link-content">
                      <span class="link-label">LinkedIn</span>
                      <span class="link-url">View professional profile</span>
                    </div>
                    <div class="link-arrow">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path d="M7 17L17 7M17 7H7M17 7V17" />
                      </svg>
                    </div>
                  </button>

                  <button
                    class="link-item portfolio-link"
                    on:click={(e) => openLink(member.portfolio, e)}
                    title="Ver portafolio"
                  >
                    <div class="link-icon">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <rect
                          x="2"
                          y="3"
                          width="20"
                          height="14"
                          rx="2"
                          ry="2"
                        />
                        <line x1="8" y1="21" x2="16" y2="21" />
                        <line x1="12" y1="17" x2="12" y2="21" />
                      </svg>
                    </div>
                    <div class="link-content">
                      <span class="link-label">Portfolio</span>
                      <span class="link-url"
                        >{member.portfolio.replace("https://", "")}</span
                      >
                    </div>
                    <div class="link-arrow">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path d="M7 17L17 7M17 7H7M17 7V17" />
                      </svg>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          {/if}
        </div>
      {/each}
    </div>

    <div class="info-column"></div>
  </div>
</div>

<style>
  .team-container {
    position: relative;
    background: linear-gradient(
      135deg,
      rgba(15, 23, 42, 0.95) 0%,
      rgba(30, 41, 59, 0.92) 50%,
      rgba(51, 65, 85, 0.9) 100%
    );
    backdrop-filter: blur(24px) saturate(180%);
    border-radius: 16px;
    border: 1px solid rgba(148, 163, 184, 0.1);
    padding: 2rem;
    overflow: hidden;
    box-shadow:
      0 24px 48px -12px rgba(0, 0, 0, 0.25),
      0 0 0 1px rgba(255, 255, 255, 0.05);
    width: 100%;
    max-width: none;
  }

  .team-grid {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: linear-gradient(
        rgba(148, 163, 184, 0.02) 1px,
        transparent 1px
      ),
      linear-gradient(90deg, rgba(148, 163, 184, 0.02) 1px, transparent 1px);
    background-size: 32px 32px;
    opacity: 0.6;
    pointer-events: none;
  }

  .team-scanner {
    position: absolute;
    top: -20px;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(99, 102, 241, 0.6),
      transparent
    );
    animation: scan-line 8s ease-in-out infinite;
    pointer-events: none;
  }

  .team-header {
    margin-bottom: 2rem;
    position: relative;
    z-index: 2;
  }

  .header-content {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .header-icon {
    width: 48px;
    height: 48px;
    background: linear-gradient(
      135deg,
      rgba(99, 102, 241, 0.12),
      rgba(168, 85, 247, 0.08)
    );
    border: 1px solid rgba(99, 102, 241, 0.2);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    animation: pulse-icon 4s ease-in-out infinite;
    box-shadow: 0 0 24px rgba(99, 102, 241, 0.1);
  }

  .team-title {
    font-size: 1.75rem;
    font-weight: 800;
    background: linear-gradient(135deg, #f8fafc 0%, #a5b4fc 30%, #e2e8f0 70%);
    background-size: 200% 200%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 6s ease-in-out infinite;
    line-height: 1.2;
    margin-bottom: 0.25rem;
  }

  .team-subtitle {
    color: rgba(148, 163, 184, 0.8);
    font-size: 0.875rem;
    font-weight: 500;
  }

  .main-layout {
    display: grid;
    grid-template-columns: 1fr 380px;
    gap: 2rem;
    position: relative;
    z-index: 2;
  }

  .members-column {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .member-card {
    background: rgba(15, 23, 42, 0.4);
    border: 1px solid rgba(148, 163, 184, 0.08);
    border-radius: 12px;
    padding: 1.25rem;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
    animation: slide-up 0.6s ease forwards;
    animation-delay: var(--delay);
    opacity: 0;
    transform: translateY(20px);
  }

  .member-card.featured {
    border-color: rgba(99, 102, 241, 0.15);
    background: linear-gradient(
      135deg,
      rgba(99, 102, 241, 0.06) 0%,
      rgba(168, 85, 247, 0.03) 100%
    );
  }

  .member-card:hover {
    background: rgba(99, 102, 241, 0.08);
    border-color: rgba(99, 102, 241, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(99, 102, 241, 0.12);
  }

  .member-card.expanded {
    background: linear-gradient(
      135deg,
      rgba(99, 102, 241, 0.1) 0%,
      rgba(168, 85, 247, 0.05) 100%
    );
    border-color: rgba(99, 102, 241, 0.25);
    box-shadow:
      0 12px 40px rgba(99, 102, 241, 0.15),
      0 0 0 1px rgba(99, 102, 241, 0.1);
  }

  .status-indicator {
    position: absolute;
    top: 0;
    right: 0;
    width: 4px;
    height: 100%;
    border-radius: 0 12px 12px 0;
    opacity: 0.8;
  }

  .card-glow {
    position: absolute;
    top: 0;
    left: -100%;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(99, 102, 241, 0.04),
      transparent
    );
    transition: left 0.6s ease;
    pointer-events: none;
  }

  .member-card:hover .card-glow {
    left: 100%;
  }

  .card-content {
    display: flex;
    align-items: center;
    gap: 1rem;
    position: relative;
    z-index: 2;
  }

  .member-avatar {
    position: relative;
    width: 56px;
    height: 56px;
    flex-shrink: 0;
  }

  .avatar-ring {
    position: absolute;
    top: -3px;
    left: -3px;
    right: -3px;
    bottom: -3px;
    border: 2px solid var(--member-color);
    border-radius: 50%;
    opacity: 0.4;
    animation: rotate-ring 8s linear infinite;
  }

  .avatar-image {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid rgba(148, 163, 184, 0.1);
  }

  .avatar-badge {
    position: absolute;
    bottom: -2px;
    right: -2px;
    width: 20px;
    height: 20px;
    background: var(--member-color);
    border: 2px solid rgba(15, 23, 42, 0.8);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: pulse-status 2s ease-in-out infinite;
  }

  .member-info {
    flex: 1;
    min-width: 0;
  }

  .member-name {
    font-size: 1.1rem;
    font-weight: 700;
    color: #f8fafc;
    margin-bottom: 0.25rem;
    line-height: 1.2;
  }

  .member-role {
    font-size: 0.875rem;
    color: #a5b4fc;
    font-weight: 600;
    margin-bottom: 0.375rem;
  }

  .member-status {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    animation: pulse-dot 2s ease-in-out infinite;
  }

  .status-text {
    font-size: 0.75rem;
    color: rgba(148, 163, 184, 0.8);
    font-weight: 500;
  }

  .member-stats {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .expand-btn {
    width: 28px;
    height: 28px;
    background: rgba(148, 163, 184, 0.06);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(148, 163, 184, 0.1);
    transition: all 0.3s ease;
  }

  .expand-btn:hover {
    background: rgba(99, 102, 241, 0.1);
    border-color: rgba(99, 102, 241, 0.2);
  }

  .expand-icon {
    transition: transform 0.3s ease;
  }

  .expand-icon.rotated {
    transform: rotate(180deg);
  }

  .member-details {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(148, 163, 184, 0.08);
    animation: expand-details 0.4s ease;
  }

  .skills-section {
    margin-bottom: 1.5rem;
  }

  .skills-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
    font-size: 0.8rem;
    font-weight: 600;
    color: #a5b4fc;
  }

  .skills-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.375rem;
  }

  .skill-chip {
    background: rgba(15, 23, 42, 0.6);
    border: 1px solid rgba(99, 102, 241, 0.2);
    border-radius: 6px;
    padding: 0.25rem 0.5rem;
    font-size: 0.7rem;
    color: #e2e8f0;
    font-weight: 500;
    backdrop-filter: blur(12px);
  }

  /* Estilos para la sección de enlaces */
  .links-section {
    margin-top: 1rem;
  }

  .links-header {
    margin-bottom: 0.75rem;
    font-size: 0.8rem;
    font-weight: 600;
    color: #a5b4fc;
  }

  .links-grid {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .link-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    background: rgba(15, 23, 42, 0.4);
    border: 1px solid rgba(148, 163, 184, 0.1);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    text-align: left;
    width: 100%;
    position: relative;
    overflow: hidden;
  }

  .link-item::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(99, 102, 241, 0.03),
      transparent
    );
    transition: left 0.6s ease;
    pointer-events: none;
  }

  .link-item:hover::before {
    left: 100%;
  }

  .link-item:hover {
    border-color: rgba(99, 102, 241, 0.3);
    background: rgba(99, 102, 241, 0.08);
    transform: translateX(4px);
    box-shadow: 0 4px 16px rgba(99, 102, 241, 0.1);
  }

  .github-link:hover {
    border-color: rgba(34, 197, 94, 0.3);
    background: rgba(34, 197, 94, 0.05);
    box-shadow: 0 4px 16px rgba(34, 197, 94, 0.1);
  }

  .linkedin-link:hover {
    border-color: rgba(59, 130, 246, 0.3);
    background: rgba(59, 130, 246, 0.05);
    box-shadow: 0 4px 16px rgba(59, 130, 246, 0.1);
  }

  .portfolio-link:hover {
    border-color: rgba(168, 85, 247, 0.3);
    background: rgba(168, 85, 247, 0.05);
    box-shadow: 0 4px 16px rgba(168, 85, 247, 0.1);
  }

  .link-icon {
    width: 32px;
    height: 32px;
    background: rgba(148, 163, 184, 0.1);
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #a5b4fc;
    flex-shrink: 0;
    transition: all 0.3s ease;
  }

  .github-link:hover .link-icon {
    background: rgba(34, 197, 94, 0.15);
    color: #22c55e;
  }

  .linkedin-link:hover .link-icon {
    background: rgba(59, 130, 246, 0.15);
    color: #3b82f6;
  }

  .portfolio-link:hover .link-icon {
    background: rgba(168, 85, 247, 0.15);
    color: #a855f7;
  }

  .link-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  .link-label {
    font-size: 0.8rem;
    font-weight: 600;
    color: #f8fafc;
    line-height: 1.2;
  }

  .link-url {
    font-size: 0.7rem;
    color: rgba(148, 163, 184, 0.7);
    font-weight: 400;
    line-height: 1.2;
  }

  .link-arrow {
    color: rgba(148, 163, 184, 0.5);
    transition: all 0.3s ease;
    flex-shrink: 0;
  }

  .link-item:hover .link-arrow {
    color: #a5b4fc;
    transform: translate(2px, -2px);
  }

  .info-column {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
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

  @keyframes pulse-icon {
    0%,
    100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.8;
      transform: scale(1.05);
    }
  }

  @keyframes scan-line {
    0% {
      transform: translateY(0);
      opacity: 1;
    }
    50% {
      opacity: 0.6;
    }
    100% {
      transform: translateY(100vh);
      opacity: 0;
    }
  }

  @keyframes slide-up {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes rotate-ring {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes pulse-status {
    0%,
    100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.7;
      transform: scale(1.1);
    }
  }

  @keyframes pulse-dot {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  @keyframes expand-details {
    from {
      opacity: 0;
      max-height: 0;
    }
    to {
      opacity: 1;
      max-height: 300px;
    }
  }
</style>
