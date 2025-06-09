<script>
    import Icon from "../lib/Icon.svelte";
    const teamMembers = [
      {
        id: 1,
        name: "Luis Felipe Sante Taipe",
        role: "Full Stack Developer",
        specialty: "React & Node.js",
        avatar: "",
        skills: ["JavaScript", "Svelte", "Python", "PostgreSQL"],
        github: "LuisSante",
        experience: "5+ años",
        commits: "1",
        projects: "xx",
        status: "coding"
      },
      {
        id: 2,
        name: "Andres de la Puente",
        role: "Frontend Architect",
        specialty: "UI/UX & Performance",
        avatar: "",
        skills: ["TypeScript", "CSS", "Design Systems", "Three.js"],
        github: "yourGH",
        experience: "7+ años",
        commits: "1",
        projects: "xx",
        status: "designing"
      },
      {
        id: 3,
        name: "Leandro Leighton",
        role: "Backend Engineer",
        specialty: "DevOps & Security",
        avatar: "",
        skills: ["Go", "Docker", "Kubernetes", "MongoDB"],
        github: "yourGH",
        experience: "6+ años",
        commits: "1",
        projects: "xx",
        status: "deploying"
      }
    ];
  
    let selectedMember = null;
    let hoveredMember = null;
  
    function selectMember(member) {
      selectedMember = selectedMember?.id === member.id ? null : member;
    }
  
    function getStatusColor(status) {
      const colors = {
        coding: "#10b981",
        designing: "#8b5cf6", 
        deploying: "#f59e0b"
      };
      return colors[status] || "#10b981";
    }
  
    function getStatusText(status) {
      const texts = {
        coding: "Codificando",
        designing: "Diseñando",
        deploying: "Desplegando"
      };
      return texts[status] || "Activo";
    }
  </script>
  
  <div class="team-container">
    <div class="team-grid"></div>
    <div class="team-scanner"></div>
    
    <!-- Header Principal -->
    <div class="team-header">
      <div class="header-content">
        <div class="header-icon">👨‍💻</div>
        <div class="header-text">
          <h2 class="team-title">Nuestro Equipo</h2>
          <p class="team-subtitle">Los desarrolladores detrás de SUPT</p>
        </div>
      </div>
    </div>
  
    <!-- Layout Principal -->
    <div class="main-layout">
      
      <!-- Columna Izquierda - Cards de Miembros -->
      <div class="members-column">
        {#each teamMembers as member, index}
          <div 
            class="member-card" 
            class:expanded={selectedMember?.id === member.id}
            class:featured={index === 0}
            on:click={() => selectMember(member)}
            on:mouseenter={() => hoveredMember = member}
            on:mouseleave={() => hoveredMember = null}
            on:keydown={(e) => e.key === 'Enter' && selectMember(member)}
            role="button"
            tabindex="0"
            style="--delay: {index * 0.15}s; --member-color: {getStatusColor(member.status)}"
          >
            <div class="card-glow"></div>
            <div class="status-indicator" style="background: {getStatusColor(member.status)}"></div>
            
            <div class="card-content">
              <div class="member-avatar">
                <div class="avatar-ring"></div>
                <img 
                  src={member.avatar} 
                  alt={member.name}
                  class="avatar-image"
                />
                <div class="avatar-badge">
                  <Icon name="zap" size={12} color="#f8fafc" />
                </div>
              </div>
  
              <div class="member-info">
                <h3 class="member-name">{member.name}</h3>
                <p class="member-role">{member.role}</p>
                <div class="member-status">
                  <div class="status-dot" style="background: {getStatusColor(member.status)}"></div>
                  <span class="status-text">{getStatusText(member.status)}</span>
                </div>
              </div>
  
              <div class="member-stats">
                <div class="stat-mini">
                  <div class="stat-value">{member.commits}</div>
                  <div class="stat-label">commits</div>
                </div>
                <div class="expand-btn">
                  <div class="expand-icon" class:rotated={selectedMember?.id === member.id}>
                    <Icon name="chevron-down" size={16} color="#a5b4fc" />
                  </div>
                </div>
              </div>
            </div>
  
            {#if selectedMember?.id === member.id}
              <div class="member-details">
                <div class="skills-section">
                  <div class="skills-header">
                    <Icon name="code" size={14} color="#a5b4fc" />
                    <span>Stack Tecnológico</span>
                  </div>
                  <div class="skills-grid">
                    {#each member.skills as skill}
                      <div class="skill-chip">{skill}</div>
                    {/each}
                  </div>
                </div>
  
                <div class="details-grid">
                  <div class="detail-item">
                    <Icon name="github" size={14} color="#94a3b8" />
                    <span>@{member.github}</span>
                  </div>
                  <div class="detail-item">
                    <Icon name="folder" size={14} color="#94a3b8" />
                    <span>{member.projects} proyectos</span>
                  </div>
                </div>
              </div>
            {/if}
          </div>
        {/each}
      </div>
  
      <div class="info-column">
      </div>
    </div>
  </div>
  
  <style>
    .team-container {
      position: relative;
      background: 
        linear-gradient(135deg, 
          rgba(15, 23, 42, 0.95) 0%, 
          rgba(30, 41, 59, 0.92) 50%,
          rgba(51, 65, 85, 0.90) 100%
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
      background-image: 
        linear-gradient(rgba(148, 163, 184, 0.02) 1px, transparent 1px),
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
      background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.6), transparent);
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
      background: 
        linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(168, 85, 247, 0.08));
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
      background: linear-gradient(
        135deg, 
        #f8fafc 0%, 
        #a5b4fc 30%, 
        #e2e8f0 70%
      );
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
      background: 
        linear-gradient(135deg, 
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
      background: 
        linear-gradient(135deg, 
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
      background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.04), transparent);
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
  
    .stat-mini {
      text-align: center;
    }
  
    .stat-mini .stat-value {
      font-size: 0.875rem;
      font-weight: 700;
      color: #a5b4fc;
      line-height: 1;
    }
  
    .stat-mini .stat-label {
      font-size: 0.625rem;
      color: rgba(148, 163, 184, 0.6);
      font-weight: 500;
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
      margin-bottom: 1rem;
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
  
    .details-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
    }
  
    .detail-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.75rem;
      color: rgba(148, 163, 184, 0.8);
    }
  
    .info-column {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
   
    @keyframes shimmer {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }
  
    @keyframes pulse-icon {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.8; transform: scale(1.05); }
    }
  
    @keyframes scan-line {
      0% { transform: translateY(0); opacity: 1; }
      50% { opacity: 0.6; }
      100% { transform: translateY(100vh); opacity: 0; }
    }
  
    @keyframes slide-up {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  
    @keyframes rotate-ring {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  
    @keyframes pulse-status {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.7; transform: scale(1.1); }
    }
  
    @keyframes pulse-dot {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  
    @keyframes expand-details {
      from {
        opacity: 0;
        max-height: 0;
      }
      to {
        opacity: 1;
        max-height: 200px;
      }
    }
  </style>