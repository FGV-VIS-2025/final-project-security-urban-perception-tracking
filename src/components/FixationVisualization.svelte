<script>
  import { onMount, afterUpdate } from "svelte";
  import { currentImage } from "../stores/appStore.js";
  import { base } from "$app/paths";
  import * as d3 from "d3";

  export let imagePath = "";
  export let imageWidth = 600;
  export let imageHeight = 450;
  
  let svgContainer;
  let gazeData = [];
  let fixationData = [];
  let mounted = false;
  let imageLoaded = false;

  // Parámetros I-VT (como en tu código Python)
  const VEL_THRESH = 50;    // px/s
  const MIN_DURATION = 0.1; // segundos

  onMount(async () => {
    mounted = true;
    await loadGazeData();
  });

  $: if (mounted && $currentImage) {
    loadGazeData();
  }

  async function loadGazeData() {
    try {
      const response = await fetch(base + "/df_todo_con_clase_ratio.csv");
      if (response.ok) {
        const csvText = await response.text();
        const allData = parseCSV(csvText);
        
        // Filtrar datos para la imagen actual
        gazeData = allData.filter(d => d.ImageName == $currentImage);
        
        console.log(`Datos de gaze cargados para imagen ${$currentImage}:`, gazeData.length);
        
        // Detectar fijaciones usando algoritmo I-VT
        detectFixations();
      } else {
        console.error("No se pudo cargar df_todo_con_clase_ratio.csv");
        gazeData = [];
        fixationData = [];
      }
    } catch (error) {
      console.error("Error loading gaze data:", error);
      gazeData = [];
      fixationData = [];
    }
  }

  function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      const row = {};
      
      headers.forEach((header, index) => {
        const value = values[index]?.trim();
        
        if (['Time', 'X', 'Y', 'Z', 'localX', 'localY', 'pixelX', 'pixelY', 'ratio'].includes(header)) {
          row[header] = parseFloat(value) || 0;
        } else if (['ImageIndex', 'participante', 'ImageName', 'class_id'].includes(header)) {
          row[header] = parseInt(value) || 0;
        } else {
          row[header] = value || '';
        }
      });
      
      data.push(row);
    }
    
    return data;
  }

  function detectFixations() {
    // Implementación exacta del algoritmo I-VT de tu código Python
    if (gazeData.length === 0) {
      fixationData = [];
      return;
    }

    // 1) Ordenar por participante y tiempo
    const sortedData = [...gazeData].sort((a, b) => {
      if (a.participante !== b.participante) {
        return a.participante - b.participante;
      }
      return a.Time - b.Time;
    });

    // 2) Calcular velocidades por participante
    const dataWithVelocity = [];
    const participants = [...new Set(sortedData.map(d => d.participante))];

    participants.forEach(participant => {
      const participantData = sortedData.filter(d => d.participante === participant);
      
      participantData.forEach((current, index) => {
        let velocity = 0;
        let dt = 0;
        let dx = 0;
        let dy = 0;
        
        if (index > 0) {
          const previous = participantData[index - 1];
          dt = current.Time - previous.Time;
          dx = current.pixelX - previous.pixelX;
          dy = current.pixelY - previous.pixelY;
          
          // Calcular velocidad en px/s
          if (dt > 0) {
            velocity = Math.sqrt(dx * dx + dy * dy) / dt;
          }
        }
        
        dataWithVelocity.push({
          ...current,
          dt: dt,
          dx: dx,
          dy: dy,
          velocity: velocity,
          is_fix: velocity < VEL_THRESH
        });
      });
    });

    // 3) Agrupar en clusters consecutivos de fijación
    let cluster = 0;
    let prevParticipant = null;
    let prevIsFix = false;

    dataWithVelocity.forEach(d => {
      if (d.participante !== prevParticipant) {
        cluster++;
        prevIsFix = d.is_fix;
      } else if (d.is_fix !== prevIsFix) {
        cluster++;
        prevIsFix = d.is_fix;
      }
      
      d.cluster = cluster;
      prevParticipant = d.participante;
    });

    // 4) Extraer fijaciones válidas
    const fixEvents = [];
    const clusters = {};
    
    // Agrupar por cluster
    dataWithVelocity.forEach(d => {
      if (d.is_fix) {
        if (!clusters[d.cluster]) {
          clusters[d.cluster] = [];
        }
        clusters[d.cluster].push(d);
      }
    });

    // Procesar cada cluster
    Object.values(clusters).forEach(clusterData => {
      if (clusterData.length === 0) return;
      
      const participant = clusterData[0].participante;
      const start = clusterData[0].Time;
      const end = clusterData[clusterData.length - 1].Time;
      const duration = end - start;
      
      // Solo fijaciones que cumplan duración mínima
      if (duration >= MIN_DURATION) {
        const x_centroid = clusterData.reduce((sum, d) => sum + d.pixelX, 0) / clusterData.length;
        const y_centroid = clusterData.reduce((sum, d) => sum + d.pixelY, 0) / clusterData.length;
        
        // Escalar a dimensiones de display
        const displayScaleX = imageWidth / 800; // pixelX está en 800px
        const displayScaleY = imageHeight / 600; // pixelY está en 600px
        
        fixEvents.push({
          participante: participant,
          ImageName: $currentImage,
          start: start,
          end: end,
          duration: duration,
          x_centroid: x_centroid * displayScaleX,
          y_centroid: (600 - y_centroid) * displayScaleY, // Invertir Y como en Python
          pointCount: clusterData.length,
          // Información adicional
          class_names: [...new Set(clusterData.map(d => d.class_name).filter(c => c))]
        });
      }
    });

    fixationData = fixEvents;
    console.log(`Fijaciones detectadas para imagen ${$currentImage}:`, fixationData.length);
    console.log("Fijaciones por participante:", 
      participants.map(p => ({
        participante: p, 
        fijaciones: fixationData.filter(f => f.participante === p).length
      }))
    );

    if (imageLoaded) {
      renderFixations();
    }
  }

 function renderFixations() {
  if (!svgContainer) return;

  d3.select(svgContainer).select(".fixation-points").selectAll("*").remove();

  const svg = d3.select(svgContainer);
  const fixationGroup = svg.select(".fixation-points");

  // Colores
  const colors = {
    fixation: "#ff6b35",    // Naranja para fijaciones
    gazePoints: "#00bfff"   // Azul para puntos de gaze
  };

  // Escalar puntos de gaze para display
  const displayScaleX = imageWidth / 800;
  const displayScaleY = imageHeight / 600;

  // Dibujar MÁS puntos de gaze y más visibles
  const sampleGazeData = gazeData.filter((_, index) => index % 2 === 0); // Cada 2do punto (más densidad)
  
  fixationGroup.selectAll(".gaze-point-all")
    .data(sampleGazeData)
    .enter()
    .append("circle")
    .attr("class", "gaze-point-all")
    .attr("cx", d => d.pixelX * displayScaleX)
    .attr("cy", d => (600 - d.pixelY) * displayScaleY) // Invertir Y
    .attr("r", 2) // Más grandes (era 1.5)
    .attr("fill", colors.gazePoints)
    .attr("opacity", 0.6); // Más visibles (era 0.4)

  // Dibujar fijaciones MÁS PEQUEÑAS como en la imagen de Python
  fixationGroup.selectAll(".fixation-point")
    .data(fixationData)
    .enter()
    .append("circle")
    .attr("class", "fixation-point")
    .attr("cx", d => d.x_centroid)
    .attr("cy", d => d.y_centroid)
    .attr("r", 6) // MÁS PEQUEÑO (era 12)
    .attr("fill", "none") // Sin relleno, solo borde
    .attr("stroke", colors.fixation) // Borde naranja
    .attr("stroke-width", 2) // Grosor del borde
    .attr("opacity", 1) // Completamente opaco
    .on("mouseover", function(event, d) {
      const tooltip = d3.select("body").append("div")
        .attr("class", "fixation-tooltip")
        .style("position", "absolute")
        .style("background", "rgba(0, 0, 0, 0.9)")
        .style("color", "white")
        .style("padding", "8px 12px")
        .style("border-radius", "6px")
        .style("font-size", "12px")
        .style("pointer-events", "none")
        .style("z-index", "1000");

      let tooltipContent = `
        <strong>Fijación</strong><br>
        <strong>Participante:</strong> ${d.participante}<br>
        <strong>Duración:</strong> ${(d.duration * 1000).toFixed(0)}ms<br>
        <strong>Puntos:</strong> ${d.pointCount}<br>
        <strong>Posición:</strong> (${d.x_centroid.toFixed(1)}, ${d.y_centroid.toFixed(1)})
      `;

      if (d.class_names.length > 0) {
        tooltipContent += `<br><strong>Clases:</strong> ${d.class_names.join(', ')}`;
      }

      tooltip.html(tooltipContent)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 10) + "px");

      // Efecto hover: aumentar ligeramente
      d3.select(this)
        .attr("r", 8) // Solo un poco más grande
        .attr("stroke-width", 3);
    })
    .on("mouseout", function(event, d) {
      d3.selectAll(".fixation-tooltip").remove();
      
      // Volver al tamaño normal
      d3.select(this)
        .attr("r", 6) // Tamaño original pequeño
        .attr("stroke-width", 2);
    });

  // Agregar números de participante en las fijaciones (más pequeños)
  /*
  fixationGroup.selectAll(".fixation-label")
    .data(fixationData)
    .enter()
    .append("text")
    .attr("class", "fixation-label")
    .attr("x", d => d.x_centroid)
    .attr("y", d => d.y_centroid + 2) // Centrado verticalmente
    .attr("text-anchor", "middle")
    .attr("font-size", "8px") // Más pequeño
    .attr("font-weight", "bold")
    .attr("fill", "#fff")
    .attr("stroke", "#000")
    .attr("stroke-width", 0.3)
    .attr("pointer-events", "none")
    .text(d => d.participante);
    */
}

  function onImageLoad() {
    imageLoaded = true;
    if (fixationData.length > 0) {
      renderFixations();
    }
  }

  $: participantCount = new Set(fixationData.map(f => f.participante)).size;
  
  $: totalGazePoints = gazeData.length;

</script>

<div class="fixation-container">
  <!-- Panel de información -->
  <div class="info-panel">
    <h3>🎯 Fixation Analysis</h3>
    <p class="panel-subtitle">Image {$currentImage}</p>
    
    <div class="fixation-stats">
      <div class="stat-item">
        <div class="stat-number">{fixationData.length}</div>
        <div class="stat-label">Total Fixations</div>
      </div>
      
      <div class="stat-item">
        <div class="stat-number">{participantCount}</div>
        <div class="stat-label">Participants</div>
      </div>

      <div class="stat-item">
        <div class="stat-number">{totalGazePoints}</div>
        <div class="stat-label">Gaze Points</div>
      </div>
    </div>


    <!-- Estadísticas por participante -->
    {#if fixationData.length > 0}
      <div class="participant-stats">
        <h4>👥 Por Participante</h4>
        <div class="participant-list">
          {#each [...new Set(fixationData.map(f => f.participante))].sort((a,b) => a-b) as participant}
            {@const participantFixations = fixationData.filter(f => f.participante === participant)}
            <div class="participant-row">
              <span class="participant-id">P{participant}:</span>
              <span class="participant-count">{participantFixations.length} fix</span>
            </div>
          {/each}
        </div>
      </div>
    {/if}
  </div>

  <!-- Visualización principal -->
  <div class="visualization-area">
    <div class="image-container">
      <img
        src={imagePath}
        alt="Image {$currentImage}"
        style="width: {imageWidth}px; height: {imageHeight}px;"
        on:load={onImageLoad}
      />
      
      <svg
        bind:this={svgContainer}
        width={imageWidth}
        height={imageHeight}
        class="fixation-overlay"
      >
        <g class="fixation-points"></g>
      </svg>

      <!-- Leyenda flotante -->
  <div class="external-legend">
    <h4>📍 Leyenda</h4>
    <div class="legend-items-external">
      <div class="legend-item-external">
        <div class="legend-dot" style="background-color: transparent; width: 12px; height: 12px; border-radius: 50%; border: 2px solid #ff6b35;"></div>
        <span class="legend-label">Fijaciones</span>
      </div>
      <div class="legend-item-external">
        <div class="legend-dot" style="background-color: #00bfff; width: 8px; height: 8px; border-radius: 50%; border: 1px solid white;"></div>
        <span class="legend-label">Puntos Gaze</span>
      </div>
    </div>
    <div class="legend-note">
      <small>Círculos naranjas = Fijaciones detectadas</small>
      <small>Puntos azules = Trayectoria de gaze</small>
    </div>
  </div>
</div>

    </div>
  </div>




<style>
  .fixation-container {
    display: flex;
    gap: 2rem;
    height: 100%;
    min-height: 500px;
  }

  .info-panel {
    width: 300px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 1.5rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    flex-shrink: 0;
  }

  .info-panel h3 {
    margin: 0 0 0.5rem 0;
    color: #ff6b35;
    font-size: 1.2rem;
  }

  .panel-subtitle {
    color: rgba(255, 255, 255, 0.6);
    margin: 0 0 1.5rem 0;
    font-size: 0.9rem;
  }

  .fixation-stats {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .stat-item {
    background: rgba(255, 107, 53, 0.1);
    border-radius: 8px;
    padding: 1rem;
    text-align: center;
    border: 1px solid rgba(255, 107, 53, 0.2);
  }

  .stat-number {
    font-size: 1.8rem;
    font-weight: 700;
    color: #ff6b35;
    margin-bottom: 0.25rem;
  }

  .stat-label {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.7);
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .algorithm-info {
    background: rgba(255, 255, 255, 0.03);
    border-radius: 8px;
    padding: 1rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .algorithm-info h4 {
    margin: 0 0 0.8rem 0;
    color: #ff6b35;
    font-size: 1rem;
  }

  .algorithm-info p {
    margin: 0.4rem 0;
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.8);
  }

  .visualization-area {
    flex: 1;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .image-container {
    position: relative;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  }

  .image-container img {
    display: block;
    border-radius: 8px;
  }

  .fixation-overlay {
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
  }


  .fixation-point {
    pointer-events: all;
    cursor: crosshair;
  }

  .floating-legend {
    position: absolute;
    top: 20px;
    right: 20px;
    background: rgba(0, 0, 0, 0.9);
    backdrop-filter: blur(10px);
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 12px;
    padding: 1rem 1.25rem;
    min-width: 140px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
    z-index: 1000;
  }

  .floating-legend h4 {
    margin: 0 0 0.8rem 0;
    color: #ffffff;
    font-size: 0.9rem;
    text-align: center;
    font-weight: 600;
  }

  .legend-items-floating {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }

  .legend-item-floating {
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  .legend-label {
    font-size: 0.8rem;
    color: #ffffff;
    font-weight: 500;
    white-space: nowrap;
  }

  /* Responsive */
  @media (max-width: 1024px) {
    .fixation-container {
      flex-direction: column;
    }

    .info-panel {
      width: 100%;
    }

    .fixation-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
    }
    .participant-stats {
        background: rgba(255, 255, 255, 0.03);
        border-radius: 8px;
        padding: 1rem;
        border: 1px solid rgba(255, 255, 255, 0.1);
        margin-top: 1rem;
    }

    .participant-stats h4 {
        margin: 0 0 0.8rem 0;
        color: #ff6b35;
        font-size: 0.9rem;
    }

    .participant-list {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.4rem;
        max-height: 120px;
        overflow-y: auto;
    }

    .participant-row {
        display: flex;
        justify-content: space-between;
        font-size: 0.75rem;
        padding: 0.2rem 0;
    }

    .participant-id {
        color: rgba(255, 255, 255, 0.8);
        font-weight: 600;
    }

    .participant-count {
        color: #ff6b35;
        font-weight: 500;
    }

    .legend-note {
        margin-top: 0.5rem;
        text-align: center;
        color: rgba(255, 255, 255, 0.6);
    }


  }
</style>