<script>
  import { onMount } from 'svelte';
  
  let mounted = false;
  
  onMount(() => {
    mounted = true;
  });
</script>

<div class="info-section" class:mounted>
  <h2>🎯 Introducción al Proyecto</h2>
  <p>
    Este proyecto presenta una herramienta interactiva de visualización de datos desarrollada 
    con <strong>Svelte</strong> y <strong>D3.js</strong>, diseñada para explorar y analizar 
    información geoespacial y temporal de manera intuitiva y moderna.
  </p>
  
  <h3>🎨 Objetivos</h3>
  <p>El objetivo principal es proporcionar una plataforma que permita a los usuarios explorar datos complejos a través de múltiples perspectivas:</p>
  
  <div class="objectives-grid">
    <div class="objective-card">
      <div class="objective-icon">⏱️</div>
      <h4>Exploración Temporal</h4>
      <p>Mediante un slider interactivo que permite navegar a través de diferentes momentos o estados de los datos de forma fluida.</p>
    </div>
    
    <div class="objective-card">
      <div class="objective-icon">🌍</div>
      <h4>Análisis Geoespacial</h4>
      <p>A través de mapas interactivos que muestran la distribución espacial de la información en Río de Janeiro.</p>
    </div>
    
    <div class="objective-card">
      <div class="objective-icon">🧠</div>
      <h4>Comprensión Integral</h4>
      <p>Combinando múltiples formas de visualización para obtener insights más profundos y significativos.</p>
    </div>
  </div>
  
  <h3>⚙️ Metodología</h3>
  <p>
    La aplicación utiliza tecnologías web modernas para crear una experiencia de usuario 
    fluida y responsiva. <strong>Svelte</strong> proporciona la reactividad y gestión del estado 
    de manera eficiente, mientras que <strong>D3.js</strong> maneja las visualizaciones complejas 
    y la manipulación de datos geoespaciales.
  </p>
  
  <div class="tech-stack">
    <div class="tech-item">
      <strong>🔧 Frontend:</strong> Svelte 3 + JavaScript ES6+
    </div>
    <div class="tech-item">
      <strong>📊 Visualización:</strong> D3.js v7 + SVG
    </div>
    <div class="tech-item">
      <strong>🎨 Estilos:</strong> CSS3 + Responsive Design
    </div>
    <div class="tech-item">
      <strong>📦 Build:</strong> Rollup + Live Reload
    </div>
  </div>
  
  <h3>📊 Datos</h3>
  <p>
    El conjunto de datos comprende <strong>150 elementos indexados (0-149)</strong>, 
    cada uno representado visualmente y geográficamente localizado en la región 
    metropolitana de Río de Janeiro, Brasil. Los datos incluyen información temporal 
    y espacial que permite múltiples perspectivas de análisis.
  </p>
  
  <div class="stats-container">
    <div class="stat-box">
      <div class="stat-number">150</div>
      <div class="stat-label">Elementos de Datos</div>
    </div>
    <div class="stat-box">
      <div class="stat-number">8</div>
      <div class="stat-label">Puntos Geográficos</div>
    </div>
    <div class="stat-box">
      <div class="stat-number">3</div>
      <div class="stat-label">Modos de Visualización</div>
    </div>
  </div>

  <h3>🚀 Características Principales</h3>
  <ul class="features-list">
    <li>✨ Interfaz moderna y responsiva</li>
    <li>🎯 Navegación intuitiva por pestañas</li>
    <li>🖼️ Visualización de imágenes con slider interactivo</li>
    <li>🗺️ Mapa interactivo de Río de Janeiro</li>
    <li>📱 Compatible con dispositivos móviles</li>
    <li>⚡ Rendimiento optimizado con Svelte</li>
  </ul>
</div>

<style>
  .info-section {
    line-height: 1.6;
    color: #333;
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s ease;
  }

  .info-section.mounted {
    opacity: 1;
    transform: translateY(0);
  }

  .info-section h2 {
    color: #667eea;
    margin-bottom: 20px;
    font-size: 2rem;
    background: linear-gradient(135deg, #667eea, #764ba2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .info-section h3 {
    color: #764ba2;
    margin: 30px 0 20px 0;
    font-size: 1.4rem;
    position: relative;
    padding-left: 15px;
  }

  .info-section h3::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 20px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 2px;
  }

  .info-section p {
    margin-bottom: 15px;
    font-size: 1.1rem;
    text-align: justify;
  }

  .objectives-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin: 20px 0;
  }

  .objective-card {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
    padding: 20px;
    border-radius: 12px;
    border: 1px solid rgba(102, 126, 234, 0.2);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .objective-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
    transition: left 0.6s ease;
  }

  .objective-card:hover::before {
    left: 100%;
  }

  .objective-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }

  .objective-icon {
    font-size: 2.5rem;
    margin-bottom: 10px;
  }

  .objective-card h4 {
    color: #667eea;
    margin-bottom: 10px;
    font-size: 1.2rem;
  }

  .objective-card p {
    font-size: 0.95rem;
    margin: 0;
    line-height: 1.5;
  }

  .tech-stack {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
    margin: 20px 0;
  }

  .tech-item {
    background: rgba(102, 126, 234, 0.1);
    padding: 12px 16px;
    border-radius: 8px;
    border-left: 4px solid #667eea;
    font-size: 0.95rem;
  }

  .stats-container {
    display: flex;
    justify-content: space-around;
    margin: 25px 0;
    flex-wrap: wrap;
    gap: 20px;
  }

  .stat-box {
    text-align: center;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    padding: 20px;
    border-radius: 12px;
    min-width: 120px;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    transition: transform 0.3s ease;
  }

  .stat-box:hover {
    transform: translateY(-3px) scale(1.05);
  }

  .stat-number {
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 5px;
  }

  .stat-label {
    font-size: 0.9rem;
    opacity: 0.9;
  }

  .features-list {
    list-style: none;
    padding: 0;
    margin: 20px 0;
  }

  .features-list li {
    padding: 8px 0;
    font-size: 1.05rem;
    transition: all 0.3s ease;
    cursor: default;
  }

  .features-list li:hover {
    color: #667eea;
    transform: translateX(10px);
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .objectives-grid {
      grid-template-columns: 1fr;
    }
    
    .tech-stack {
      grid-template-columns: 1fr;
    }
    
    .stats-container {
      flex-direction: column;
      align-items: center;
    }
    
    .info-section h2 {
      font-size: 1.8rem;
    }
    
    .info-section h3 {
      font-size: 1.2rem;
    }
  }
</style>