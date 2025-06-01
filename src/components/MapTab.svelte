<script>
  import { onMount, onDestroy } from "svelte";
  import { currentImage } from "../stores/appStore.js";

  let mapContainer;
  let map;
  let markers = [];
  let mounted = false;
  let selectedPoint = null;
  let dataPoints = [];

  let jsonData = [];

  onMount(async () => {
    await loadLeaflet();
    await loadDataFromJSON();

    mounted = true;
    initializeMap();
    const unsubscribe = currentImage.subscribe(() => {
      updateMapHighlight();
    });

    return unsubscribe;
  });

  onDestroy(() => {
    if (map) {
      map.remove();
    }
  });

  async function loadLeaflet() {
    if (!document.querySelector('link[href*="leaflet"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
      link.crossOrigin = "";
      document.head.appendChild(link);
    }

    if (!window.L) {
      return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        script.integrity =
          "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
        script.crossOrigin = "";
        script.onload = resolve;
        document.head.appendChild(script);
      });
    }
  }

  async function loadDataFromJSON() {
    try {
      const response = await fetch("./image_safety.json");
      if (response.ok) {
        jsonData = await response.json();
        console.log("Datos cargados:", jsonData.length, "puntos");

        console.log("Primeros 3 elementos:", jsonData.slice(0, 3));
        console.log("Verificar coordenadas válidas:");

        dataPoints = jsonData
          .map((point, index) => {
            const lat = point.lat;
            const lng = point.long;

            if (isNaN(lat) || isNaN(lng) || lat === null || lng === null) {
              console.warn(`Punto ${index + 1} tiene coordenadas inválidas:`, {
                lat,
                lng,
                point,
              });
              return null;
            }

            if (lat < -23.5 || lat > -22.0 || lng < -44.0 || lng > -43.0) {
              console.warn(`Punto ${index + 1} fuera del rango de Río:`, {
                lat,
                lng,
              });
            }

            return {
              id: point.Contador || index + 1,
              name: `Punto ${point.Contador || index + 1}`,
              coords: [lng, lat], // [lng, lat] para Leaflet
              lat: lat,
              lng: lng,
              safety: point.safety || 0,
              image_id: point.image_id,
            };
          })
          .filter((point) => point !== null); // Filtrar puntos inválidos

        console.log(
          "DataPoints procesados:",
          dataPoints.length,
          "de",
          jsonData.length,
          "originales"
        );
        console.log(
          "Puntos válidos:",
          dataPoints.filter((p) => !isNaN(p.lat) && !isNaN(p.lng)).length
        );
      } else {
        console.warn(
          "No se pudo cargar el archivo JSON, usando datos de ejemplo"
        );
      }
    } catch (error) {
      console.error("Error cargando datos JSON:", error);
    }
  }

  function initializeMap() {
    if (!mapContainer || !window.L) return;

    if (map) {
      map.remove();
    }

    map = window.L.map(mapContainer, {
      center: [-22.9068, -43.1729], // Río de Janeiro
      zoom: 11,
      zoomControl: true,
    });

    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 11,
    }).addTo(map);

    addMarkersToMap();
    addCustomControls();
  }

  function addMarkersToMap() {
    markers.forEach((marker) => map.removeLayer(marker));
    markers = [];

    dataPoints.forEach((point, index) => {
      const color = getSafetyColor(point.safety);
      const imagePath = `/assets/images/${point.id - 1}.jpg`;

      const customIcon = window.L.divIcon({
        className: "custom-marker",
        html: `
        <div style="
          background-color: ${color};
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 10px;
        ">
          ${point.id}
        </div>
      `,
        iconSize: [26, 26],
        iconAnchor: [13, 13],
      });

      const marker = window.L.marker([point.lat, point.lng], {
        icon: customIcon,
      }).addTo(map);

      // POPUP MODIFICADO CON IMAGEN
      const popupContent = `
      <div style="min-width: 250px; max-width: 300px;">
        <h3 style="margin: 0 0 10px 0; color: #667eea;">${point.name}</h3>
        
        <!-- IMAGEN AGREGADA -->
        <div style="margin-bottom: 15px; text-align: center;">
          <img src="${imagePath}" 
               alt="Imagen del punto ${point.id}"
               style="
                 width: 100%;
                 max-width: 250px;
                 height: 150px;
                 object-fit: cover;
                 border-radius: 8px;
                 box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                 border: 2px solid ${color};
               "
               onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"
          />
          <div style="display: none; padding: 20px; background: #f5f5f5; border-radius: 8px; color: #666;">
            📷 Imagen no disponible
          </div>
        </div>
        
        <p><strong>Coordenadas:</strong> ${point.lat.toFixed(4)}, ${point.lng.toFixed(4)}</p>
        <p><strong>Seguridad:</strong> <span style="color: ${color};">${point.safety?.toFixed(2) || "N/A"}</span></p>
      </div>
    `;

      marker.bindPopup(popupContent, {
        maxWidth: 320,
        className: "custom-popup",
      });

      marker.on("click", () => {
        selectPoint(index);
      });

      markers.push(marker);
    });

    window.selectPoint = (index) => {
      selectPoint(index);
    };
  }

  function getSafetyColor(safety) {
    if (!safety) return "#808080"; // Gris para valores no definidos
    if (safety >= 7) return "#4CAF50"; // Verde (muy seguro)
    if (safety >= 4) return "#FFC107"; // Amarillo (moderadamente seguro)
    if (safety >= 2) return "#FF9800"; // Naranja (poco seguro)
    return "#F44336"; // Rojo (inseguro)
  }

  function addCustomControls() {
    const StatsControl = window.L.Control.extend({
      onAdd: function (map) {
        const container = window.L.DomUtil.create(
          "div",
          "leaflet-stats-control"
        );
        container.style.background = "white";
        container.style.padding = "10px";
        container.style.borderRadius = "5px";
        container.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)";
        container.innerHTML = `
          <div style="font-size: 12px;">
            <strong>📊 Estadísticas</strong><br>
            Puntos: ${dataPoints.length}<br>
            Imagen: ${$currentImage}
          </div>
        `;
        return container;
      },
      onRemove: function (map) {},
    });

    new StatsControl({ position: "topright" }).addTo(map);
  }

  function selectPoint(index) {
    if (index >= 0 && index < dataPoints.length) {
      selectedPoint = dataPoints[index];
      map.setView([selectedPoint.lat, selectedPoint.lng], 15);
      currentImage.set(selectedPoint.id);
      markers.forEach((marker, i) => {
        if (i === index) {
          marker.openPopup();
        }
      });
    }
  }

  function updateMapHighlight() {
    if (!map || markers.length === 0) return;
    const currentIndex = dataPoints.findIndex(
      (point) => point.id === $currentImage
    );
    if (currentIndex >= 0) {
      selectPoint(currentIndex);
    }
  }

  function fitMapToPoints() {
    if (!map || dataPoints.length === 0) return;

    const group = new window.L.featureGroup(markers);
    map.fitBounds(group.getBounds().pad(0.1));
  }

  function resetMap() {
    if (!map) return;
    map.setView([-22.9068, -43.1729], 11);
  }
</script>

<svelte:window
  on:resize={() => {
    if (map) {
      setTimeout(() => map.invalidateSize(), 100);
    }
  }}
/>

<div class="map-section" class:mounted>
  <h2>🗺️ Mapa de Río de Janeiro</h2>
  <p class="description">
    Visualización interactiva con Leaflet mostrando puntos de datos de seguridad
    urbana. Los colores indican el nivel de seguridad percibida en cada
    ubicación.
  </p>

  <div class="map-controls-top">
    <button class="control-btn" on:click={resetMap}> 🏠 Vista Inicial </button>
    <button class="control-btn" on:click={fitMapToPoints}>
      🎯 Ver Todos los Puntos
    </button>
    <div class="data-info">
      📊 {dataPoints.length} puntos cargados
    </div>
  </div>

  <div class="map-container" bind:this={mapContainer}></div>

  <div class="map-stats">
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">📊</div>
        <div class="stat-content">
          <div class="stat-number">{dataPoints.length}</div>
          <div class="stat-label">Puntos de Datos</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">🎯</div>
        <div class="stat-content">
          <div class="stat-number">{$currentImage}</div>
          <div class="stat-label">Imagen Actual</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">🛡️</div>
        <div class="stat-content">
          <div class="stat-number">
            {dataPoints.length > 0
              ? (
                  dataPoints.reduce((sum, p) => sum + (p.safety || 0), 0) /
                  dataPoints.length
                ).toFixed(1)
              : "N/A"}
          </div>
          <div class="stat-label">Seguridad Promedio</div>
        </div>
      </div>
    </div>
  </div>

  <div class="map-legend">
    <h3>🗂️ Leyenda del Mapa</h3>
    <div class="legend-items">
      <div class="legend-item">
        <div class="legend-color" style="background: #4CAF50;"></div>
        <span>Muy Seguro (4.0 - 5.0)</span>
      </div>
      <div class="legend-item">
        <div class="legend-color" style="background: #FFC107;"></div>
        <span>Moderadamente Seguro (3.0 - 3.9)</span>
      </div>
      <div class="legend-item">
        <div class="legend-color" style="background: #FF9800;"></div>
        <span>Poco Seguro (2.0 - 2.9)</span>
      </div>
      <div class="legend-item">
        <div class="legend-color" style="background: #F44336;"></div>
        <span>Inseguro (1.0 - 1.9)</span>
      </div>
      <div class="legend-item">
        <div class="legend-color" style="background: #808080;"></div>
        <span>Sin Datos</span>
      </div>
    </div>
  </div>
</div>

<style>
  .map-section {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s ease;
  }

  .map-section.mounted {
    opacity: 1;
    transform: translateY(0);
  }

  .map-section h2 {
    color: #667eea;
    margin-bottom: 20px;
    font-size: 2rem;
    background: linear-gradient(135deg, #667eea, #764ba2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .description {
    margin-bottom: 25px;
    color: #666;
    font-size: 1.1rem;
    text-align: center;
    line-height: 1.6;
  }

  .map-controls-top {
    display: flex;
    gap: 10px;
    align-items: center;
    margin-bottom: 15px;
    flex-wrap: wrap;
  }

  .control-btn {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 20px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  }

  .control-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  .data-info {
    background: rgba(102, 126, 234, 0.1);
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 0.9rem;
    color: #667eea;
    border: 1px solid rgba(102, 126, 234, 0.2);
  }

  .map-container {
    width: 100%;
    height: 500px;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    margin-bottom: 25px;
    border: 2px solid rgba(102, 126, 234, 0.1);
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .map-stats {
    margin-bottom: 25px;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 15px;
  }

  .stat-card {
    background: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 15px;
    transition: all 0.3s ease;
    border: 1px solid rgba(102, 126, 234, 0.1);
  }

  .stat-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.2);
  }

  .stat-icon {
    font-size: 2rem;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 50%;
    color: white;
  }

  .stat-content {
    flex: 1;
  }

  .stat-number {
    font-size: 1.8rem;
    font-weight: bold;
    color: #667eea;
    line-height: 1;
  }

  .stat-label {
    font-size: 0.85rem;
    color: #666;
    margin-top: 2px;
  }

  .map-legend {
    background: rgba(118, 75, 162, 0.05);
    padding: 20px;
    border-radius: 12px;
    border: 1px solid rgba(118, 75, 162, 0.1);
  }

  .map-legend h3 {
    color: #764ba2;
    margin-bottom: 15px;
    font-size: 1.2rem;
  }

  .legend-items {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 12px;
    margin-bottom: 20px;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.9rem;
    color: #333;
  }

  .legend-color {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }

  /* Estilos globales para Leaflet */
  :global(.leaflet-container) {
    font-family: inherit;
  }

  :global(.leaflet-popup-content) {
    margin: 8px 12px;
    line-height: 1.4;
  }

  :global(.leaflet-popup-content h3) {
    margin: 0 0 8px 0;
  }

  :global(.custom-marker) {
    background: transparent !important;
    border: none !important;
  }

  :global(.leaflet-stats-control) {
    margin: 10px;
    font-family: inherit;
  }
</style>
