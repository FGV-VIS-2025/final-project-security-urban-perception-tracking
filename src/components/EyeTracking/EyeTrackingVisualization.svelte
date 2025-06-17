<script>
  import { onMount, afterUpdate } from "svelte";
  import { currentImage } from "../../stores/appStore.js";
  import { base } from "$app/paths";
  import * as d3 from "d3";

  export let imagePath = "";
  export let imageWidth = 800;
  export let imageHeight = 600;
  export let currentImageIndex = 0; // NUEVO: recibe el índice real de la imagen (0-149)
  
  let svgContainer;
  let eyeTrackingData = [];
  let participants = [];
  let selectedParticipant = null;
  let mounted = false;
  let imageLoaded = false;

  const canvasPos = [0.0, 1.1];
  const canvasSize = [0.8, 0.6];
  const imagePixels = [800, 600];

  onMount(async () => {
    mounted = true;
    await loadEyeTrackingData();
    await loadParticipants();
  });

  // ACTUALIZADO: usar currentImageIndex en lugar de $currentImage
  $: if (mounted && currentImageIndex !== undefined) {
    loadEyeTrackingData();
    selectedParticipant = null;
  }

  async function loadEyeTrackingData() {
    try {
      const response = await fetch(base + "/ALL_PROJECT_con_clase.csv");
      if (response.ok) {
        const csvText = await response.text();
        eyeTrackingData = parseCSV(csvText);
      } else {
        eyeTrackingData = generateExampleData();
      }
    } catch (error) {
      console.error("Error loading eye tracking data:", error);
      eyeTrackingData = generateExampleData();
    }
  }

  async function loadParticipants() {
    // CORREGIDO: usar currentImageIndex en lugar de $currentImage
    const imageData = eyeTrackingData.filter(d => d.ImageName == currentImageIndex);
    participants = [...new Set(imageData.map(d => d.participante))].sort((a, b) => a - b);
  }

  function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',');
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      const row = {};
      headers.forEach((header, index) => {
        const value = values[index];
        if (header === 'Time' || header === 'X' || header === 'Y' || header === 'Z' || 
            header === 'localX' || header === 'localY' || header === 'pixelX' || header === 'pixelY') {
          row[header] = parseFloat(value);
        } else if (header === 'ImageIndex' || header === 'participante') {
          row[header] = parseInt(value);
        } else {
          row[header] = value;
        }
      });
      data.push(row);
    }
    return data;
  }

  function generateExampleData() {
    const realData = [
      { Time: 7.984, X: 0.0052, Y: 1.0046, participante: 1 },
      { Time: 8.017, X: 0.0052, Y: 1.006, participante: 1 },
      { Time: 8.052, X: 0.0053, Y: 1.007, participante: 1 },
      { Time: 8.084, X: 0.0054, Y: 1.007, participante: 1 },
      { Time: 8.117, X: 0.0056, Y: 1.0059, participante: 1 },
      { Time: 8.151, X: 0.0061, Y: 1.0035, participante: 1 },
      { Time: 8.183, X: 0.0068, Y: 1.0021, participante: 1 },
      { Time: 8.217, X: 0.0079, Y: 1.0021, participante: 1 },
      { Time: 8.251, X: 0.009, Y: 1.0025, participante: 1 },
      { Time: 8.284, X: 0.0102, Y: 1.0032, participante: 1 },
      { Time: 8.317, X: 0.0113, Y: 1.0043, participante: 1 },
      { Time: 8.351, X: 0.003, Y: 1.0021, participante: 2 },
      { Time: 8.384, X: -0.0052, Y: 0.9991, participante: 2 },
      { Time: 8.417, X: -0.0134, Y: 0.9958, participante: 2 },
      { Time: 8.452, X: -0.0215, Y: 0.9927, participante: 2 },
      { Time: 8.484, X: -0.0295, Y: 0.99, participante: 2 },
      { Time: 8.516, X: -0.0374, Y: 0.988, participante: 2 },
      { Time: 8.551, X: -0.2266, Y: 0.9533, participante: 2 },
      { Time: 8.583, X: -0.2266, Y: 0.9534, participante: 2 },
      { Time: 8.617, X: -0.2272, Y: 0.9525, participante: 2 },
      { Time: 8.651, X: -0.2283, Y: 0.9509, participante: 3 },
      { Time: 8.685, X: -0.2295, Y: 0.9487, participante: 3 },
      { Time: 8.717, X: -0.231, Y: 0.9461, participante: 3 },
      { Time: 8.751, X: -0.2325, Y: 0.9436, participante: 3 },
      { Time: 8.783, X: -0.2339, Y: 0.9414, participante: 3 },
      { Time: 8.817, X: -0.2352, Y: 0.9389, participante: 3 },
      { Time: 8.851, X: -0.2365, Y: 0.9359, participante: 4 },
      { Time: 8.884, X: -0.2379, Y: 0.9328, participante: 4 },
      { Time: 8.917, X: -0.2393, Y: 0.9297, participante: 4 },
      { Time: 8.951, X: -0.2408, Y: 0.9261, participante: 4 },
      { Time: 8.984, X: -0.2424, Y: 0.9228, participante: 4 },
      { Time: 9.017, X: -0.2441, Y: 0.9198, participante: 5 },
      { Time: 9.051, X: -0.2458, Y: 0.9168, participante: 5 },
      { Time: 9.083, X: -0.2475, Y: 0.9144, participante: 5 },
      { Time: 9.116, X: -0.2489, Y: 0.9123, participante: 5 },
      { Time: 9.151, X: -0.2504, Y: 0.9104, participante: 5 },
      { Time: 9.184, X: -0.252, Y: 0.9094, participante: 6 },
      { Time: 9.217, X: -0.2536, Y: 0.909, participante: 6 },
      { Time: 9.252, X: -0.2551, Y: 0.9087, participante: 6 },
      { Time: 9.283, X: -0.2565, Y: 0.9088, participante: 6 },
      { Time: 9.317, X: -0.2578, Y: 0.9091, participante: 6 },
      { Time: 9.351, X: -0.2591, Y: 0.9094, participante: 7 },
      { Time: 9.384, X: -0.2601, Y: 0.9098, participante: 7 },
      { Time: 9.417, X: -0.261, Y: 0.9102, participante: 7 },
      { Time: 9.45, X: -0.2606, Y: 0.9109, participante: 7 },
      { Time: 9.484, X: -0.2511, Y: 0.9148, participante: 7 },
      { Time: 9.517, X: -0.2419, Y: 0.9186, participante: 8 },
      { Time: 9.551, X: -0.233, Y: 0.9223, participante: 8 },
      { Time: 9.583, X: -0.2245, Y: 0.9258, participante: 8 },
      { Time: 9.617, X: -0.2164, Y: 0.9293, participante: 8 },
      { Time: 9.652, X: -0.2086, Y: 0.9325, participante: 8 },
      { Time: 9.684, X: -0.0242, Y: 0.9986, participante: 9 },
      { Time: 9.717, X: -0.0242, Y: 0.9986, participante: 9 },
      { Time: 9.751, X: -0.0225, Y: 0.9992, participante: 9 },
      { Time: 9.784, X: -0.0197, Y: 1.0, participante: 9 },
      { Time: 9.817, X: -0.0163, Y: 1.0011, participante: 9 },
      { Time: 9.851, X: -0.0125, Y: 1.0025, participante: 10 },
      { Time: 9.884, X: -0.0085, Y: 1.004, participante: 10 },
      { Time: 9.917, X: -0.0044, Y: 1.0056, participante: 10 },
      { Time: 9.951, X: -0.001, Y: 1.0073, participante: 10 },
      { Time: 9.983, X: -0.001, Y: 1.0073, participante: 10 }
    ];

    // CORREGIDO: usar currentImageIndex en lugar de $currentImage
    return realData.map(d => ({
      Time: d.Time,
      ImageIndex: 0,
      ImageName: currentImageIndex,
      X: d.X,
      Y: d.Y,
      Z: 1.9762,
      participante: d.participante,
      localX: 0,
      localY: 0,
      pixelX: 0,
      pixelY: 0,
      class_id: 7,
      class_name: "road;route"
    }));
  }

  function convertWorldToPixel(worldX, worldY) {
    const canvasPos = [0.0, 1.1];
    const canvasSize = [0.8, 0.6];
    const imagePixels = [800, 600];
    
    const cx = canvasPos[0];
    const cy = canvasPos[1];
    const localX = worldX - cx;
    const localY = worldY - cy;
    
    const world_w = canvasSize[0];
    const world_h = canvasSize[1];
    const px_w = imagePixels[0];
    const px_h = imagePixels[1];
    
    const scale_x = px_w / world_w;
    const scale_y = px_h / world_h;
    
    const pixelX = localX * scale_x + px_w / 2;
    const pixelY = localY * scale_y + px_h / 2;
    
    const displayWidth = 600;
    const displayHeight = 450;
    
    const scaleToDisplay_x = displayWidth / px_w;
    const scaleToDisplay_y = displayHeight / px_h;
    
    return { 
      x: pixelX * scaleToDisplay_x, 
      y: (px_h - pixelY) * scaleToDisplay_y  
    };
  }

  function selectParticipant(participant) {
    selectedParticipant = participant;
    if (svgContainer) {
      renderEyeTracking();
    }
  }

  function renderEyeTracking() {
    if (!svgContainer || !selectedParticipant) return;

    // Limpiar visualización anterior
    d3.select(svgContainer).select(".gaze-points").selectAll("*").remove();

    // CORREGIDO: usar currentImageIndex en lugar de $currentImage
    const participantData = eyeTrackingData.filter(d => 
      d.participante === selectedParticipant && d.ImageName == currentImageIndex
    );

    if (participantData.length === 0) return;

    // Convertir coordenadas
    const gazePoints = participantData.map(d => {
      const pixel = convertWorldToPixel(d.X, d.Y);
      return {
        ...d,
        px: pixel.x,
        py: pixel.y
      };
    });

    const svg = d3.select(svgContainer);
    const gazeGroup = svg.select(".gaze-points");

    // Colores para diferentes elementos
    const colors = {
      path: "#00bfff",        // Azul para la línea
      normalPoint: "#00bfff", // Azul para puntos normales
      startPoint: "#00ff00",  // Verde para punto inicial
      endPoint: "#ff0000",    // Rojo para punto final
      arrow: "#ffff00"        // Amarillo para flechitas
    };

    // Definir marcador de flecha para las líneas direccionales
    svg.append("defs").append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 8)
      .attr("refY", 0)
      .attr("markerWidth", 4)
      .attr("markerHeight", 4)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", colors.arrow)
      .attr("stroke", colors.arrow);

    // Dibujar línea de trayectoria principal
    const line = d3.line()
      .x(d => d.px)
      .y(d => d.py)
      .curve(d3.curveCardinal);

    gazeGroup.append("path")
      .datum(gazePoints)
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", colors.path)
      .attr("stroke-width", 2)
      .attr("opacity", 0.6);

    // Dibujar flechitas direccionales (cada ciertos puntos para no saturar)
    const arrowInterval = Math.max(1, Math.floor(gazePoints.length / 8)); // Máximo 8 flechas
    
    for (let i = 0; i < gazePoints.length - 1; i += arrowInterval) {
      const current = gazePoints[i];
      const next = gazePoints[i + 1];
      
      // Calcular la distancia para evitar flechas muy cortas
      const distance = Math.sqrt(
        Math.pow(next.px - current.px, 2) + Math.pow(next.py - current.py, 2)
      );
      
      // Solo dibujar flecha si la distancia es suficiente
      if (distance > 10) {
        gazeGroup.append("line")
          .attr("x1", current.px)
          .attr("y1", current.py)
          .attr("x2", next.px)
          .attr("y2", next.py)
          .attr("stroke", colors.arrow)
          .attr("stroke-width", 1.5)
          .attr("opacity", 0.7)
          .attr("marker-end", "url(#arrowhead)");
      }
    }

    // Dibujar puntos normales (excluyendo primero y último)
    if (gazePoints.length > 2) {
      gazeGroup.selectAll(".gaze-point-normal")
        .data(gazePoints.slice(1, -1)) // Excluir primer y último punto
        .enter()
        .append("circle")
        .attr("class", "gaze-point-normal")
        .attr("cx", d => d.px)
        .attr("cy", d => d.py)
        .attr("r", 3)
        .attr("fill", colors.normalPoint)
        .attr("stroke", "#fff")
        .attr("stroke-width", 1)
        .attr("opacity", 0.8)
        .on("mouseover", function(event, d) {
          showTooltip(event, d, "Punto intermedio");
          d3.select(this).attr("r", 5);
        })
        .on("mouseout", function() {
          hideTooltip();
          d3.select(this).attr("r", 3);
        });
    }

    // Dibujar punto inicial (verde) - SIN TEXTO
    if (gazePoints.length > 0) {
      gazeGroup.append("circle")
        .datum(gazePoints[0])
        .attr("class", "start-point")
        .attr("cx", d => d.px)
        .attr("cy", d => d.py)
        .attr("r", 6)
        .attr("fill", colors.startPoint)
        .attr("stroke", "#fff")
        .attr("stroke-width", 2)
        .attr("opacity", 1)
        .on("mouseover", function(event, d) {
          showTooltip(event, d, "Punto inicial");
          d3.select(this).attr("r", 8);
        })
        .on("mouseout", function() {
          hideTooltip();
          d3.select(this).attr("r", 6);
        });
    }

    // Dibujar punto final (rojo) - SIN TEXTO
    if (gazePoints.length > 1) {
      gazeGroup.append("circle")
        .datum(gazePoints[gazePoints.length - 1])
        .attr("class", "end-point")
        .attr("cx", d => d.px)
        .attr("cy", d => d.py)
        .attr("r", 6)
        .attr("fill", colors.endPoint)
        .attr("stroke", "#fff")
        .attr("stroke-width", 2)
        .attr("opacity", 1)
        .on("mouseover", function(event, d) {
          showTooltip(event, d, "Punto final");
          d3.select(this).attr("r", 8);
        })
        .on("mouseout", function() {
          hideTooltip();
          d3.select(this).attr("r", 6);
        });
    }

    // Funciones auxiliares para tooltips
    function showTooltip(event, d, type) {
      const tooltip = d3.select("body").append("div")
        .attr("class", "eye-tracking-tooltip")
        .style("position", "absolute")
        .style("background", "rgba(0, 0, 0, 0.9)")
        .style("color", "white")
        .style("padding", "8px 12px")
        .style("border-radius", "6px")
        .style("font-size", "12px")
        .style("pointer-events", "none")
        .style("z-index", "1000")
        .style("box-shadow", "0 4px 12px rgba(0,0,0,0.3)");

      tooltip.html(`
        <strong>${type}</strong><br>
        <strong>Participante:</strong> ${d.participante}<br>
        <strong>Tiempo:</strong> ${d.Time.toFixed(3)}s<br>
        <strong>Posición:</strong> (${d.px.toFixed(1)}, ${d.py.toFixed(1)})
      `)
      .style("left", (event.pageX + 10) + "px")
      .style("top", (event.pageY - 10) + "px");
    }

    function hideTooltip() {
      d3.selectAll(".eye-tracking-tooltip").remove();
    }
  }

  function onImageLoad() {
    imageLoaded = true;
    if (svgContainer && selectedParticipant) {
      renderEyeTracking();
    }
  }

  $: if (mounted && eyeTrackingData.length > 0) {
    loadParticipants();
  }

  $: if (selectedParticipant && imageLoaded) {
    setTimeout(renderEyeTracking, 100);
  }
</script>

 <div class="eye-tracking-container">  
  <!-- Panel de participantes -->
  <div class="participants-panel">
    <h3>👥 Participants</h3>
    <!-- CORREGIDO: mostrar currentImageIndex + 1 para que se vea como 1-150 -->
    <p class="panel-subtitle">Image {currentImageIndex + 1}</p>
    
    <div class="participants-list">
      {#each participants as participant}
        <button
          class="participant-btn"
          class:active={selectedParticipant === participant}
          on:click={() => selectParticipant(participant)}
        >
          <div class="participant-number">P{participant}</div>
          <div class="participant-label">Participant {participant}</div>
        </button>
      {/each}
    </div> 

    {#if selectedParticipant}
      <div class="selected-info">
        <h4>🎯 Active Tracking</h4>
        <p><strong>Participant:</strong> {selectedParticipant}</p>
        <!-- CORREGIDO: mostrar currentImageIndex + 1 para que se vea como 1-150 -->
        <p><strong>Image:</strong> {currentImageIndex + 1}</p>
        <p><strong>Data Points:</strong> {eyeTrackingData.filter(d => d.participante === selectedParticipant && d.ImageName == currentImageIndex).length}</p>
      </div>
    {/if}

    <!-- LEYENDA MOVIDA AQUÍ -->
    {#if selectedParticipant}
      <div class="legend-panel">
        <h4>📍 Leyenda</h4>
        <div class="legend-items">
          <div class="legend-item">
            <div class="legend-dot green"></div>
            <span class="legend-label">Punto Inicial</span>
          </div>
          <div class="legend-item">
            <div class="legend-dot red"></div>
            <span class="legend-label">Punto Final</span>
          </div>
          <div class="legend-item">
            <div class="legend-dot blue"></div>
            <span class="legend-label">Trayectoria</span>
          </div>
        </div>
      </div>
    {/if}
  </div>

  <!-- Visualización principal -->
  <div class="visualization-area">
    <div class="image-container">
      <img
        src={imagePath}
        alt="Image {currentImageIndex + 1}"
        style="width: {imageWidth}px; height: {imageHeight}px;"
        on:load={onImageLoad}
      />
      
      <svg
        bind:this={svgContainer}
        width={imageWidth}
        height={imageHeight}
        class="eye-tracking-overlay"
      >
        <g class="gaze-points"></g>
      </svg>
    </div>

    {#if !selectedParticipant}
      <div class="no-selection">
        <div class="no-selection-content">
          <div class="icon">👁️</div>
          <h3>Select a Participant</h3>
          <p>Choose a participant from the left panel to view their eye tracking data</p>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .eye-tracking-container {
    display: flex;
    gap: 2rem;
    height: 100%;
    min-height: 500px;
  }

  .participants-panel {
    width: 300px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 1.5rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    flex-shrink: 0;
  }

  .participants-panel h3 {
    margin: 0 0 0.5rem 0;
    color: #667eea;
    font-size: 1.2rem;
  }

  .panel-subtitle {
    color: rgba(255, 255, 255, 0.6);
    margin: 0 0 1.5rem 0;
    font-size: 0.9rem;
  }

  .participants-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 2rem;
    max-height: 300px;
    overflow-y: auto;
  }

  .participant-btn {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 1rem;
    color: white;
  }

  .participant-btn:hover {
    background: rgba(102, 126, 234, 0.2);
    border-color: rgba(102, 126, 234, 0.4);
    transform: translateY(-1px);
  }

  .participant-btn.active {
    background: rgba(102, 126, 234, 0.3);
    border-color: #667eea;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }

  .participant-number {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 0.9rem;
  }

  .participant-label {
    font-size: 0.9rem;
    flex: 1;
  }

  .selected-info {
    background: rgba(102, 126, 234, 0.1);
    border-radius: 8px;
    padding: 1rem;
    border: 1px solid rgba(102, 126, 234, 0.2);
  }

  .selected-info h4 {
    margin: 0 0 0.5rem 0;
    color: #667eea;
    font-size: 1rem;
  }

  .selected-info p {
    margin: 0.25rem 0;
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.8);
  }

  .legend-panel {
    background: rgba(102, 126, 234, 0.1);
    border-radius: 8px;
    padding: 1rem;
    border: 1px solid rgba(102, 126, 234, 0.2);
    margin-top: 1rem;
  }

  .legend-panel h4 {
    margin: 0 0 0.75rem 0;
    color: #667eea;
    font-size: 1rem;
  }

  .legend-items {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .legend-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .legend-dot.green {
    background-color: #00ff00;
    border: 1px solid #fff;
  }

  .legend-dot.red {
    background-color: #ff0000;
    border: 1px solid #fff;
  }

  .legend-dot.blue {
    background-color: #00bfff;
    border: 1px solid #fff;
  }

  .legend-label {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.9);
    font-weight: 500;
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

  .eye-tracking-overlay {
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
  }

  .no-selection {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(5px);
    border-radius: 8px;
  }

  .no-selection-content {
    text-align: center;
    color: rgba(255, 255, 255, 0.8);
  }

  .no-selection .icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .no-selection h3 {
    margin: 0 0 0.5rem 0;
    color: white;
  }

  .no-selection p {
    margin: 0;
    font-size: 0.9rem;
  }

  /* Responsive */
  @media (max-width: 1024px) {
    .eye-tracking-container {
      flex-direction: column;
    }

    .participants-panel {
      width: 100%;
    }

    .participants-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 0.5rem;
      max-height: none;
    }
  }

  @media (max-width: 768px) {
    .eye-tracking-container {
      gap: 1rem;
    }

    .participants-panel {
      padding: 1rem;
    }

    .participants-list {
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    }

    .participant-btn {
      padding: 0.8rem;
    }

    .participant-number {
      width: 35px;
      height: 35px;
      font-size: 0.8rem;
    }
  }

  /* Tooltip styles globales */
  :global(.eye-tracking-tooltip) {
    font-family: "Inter", system-ui, sans-serif !important;
  }
</style>