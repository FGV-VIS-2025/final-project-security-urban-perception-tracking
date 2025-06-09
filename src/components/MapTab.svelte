<script>
  import { onMount, onDestroy } from "svelte";
  import { currentImage } from "../stores/appStore.js";
  import SliderTab from "./SliderTab.svelte";
  import { base } from "$app/paths";
  import SecurityMetrics from "./SecurityMetrics.svelte";
  import MapIcon from "../lib/Icons/MapIcon.svelte";
  import ChartIcon from "../lib/Icons/ChartIcon.svelte";
  import DataBaseIcon from "../lib/Icons/DataBaseIcon.svelte";

  let mapContainer;
  let map;
  let markers = [];
  let mounted = false;
  let selectedPoint = null;
  let dataPoints = [];
  let jsonData = [];

  //Funcion para evitar bug de Mapa
  export function invalidateMapSize() {
    if (map) {
      map.invalidateSize();
      console.log("map.invalidateSize() llamado desde MapTab.svelte.");
    }
  }

  onMount(async () => {
    await loadLeaflet();
    await loadDataFromJSON();

    mounted = true;
    initializeMap();
    // const unsubscribe = currentImage.subscribe(() => {
    //   updateMapHighlight();
    // });
    // return unsubscribe;
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
      // const response = await fetch(base +"/image_safety.json");
      const response = await fetch(base +"/image_safety.json");
      if (response.ok) {
        jsonData = await response.json();
        console.log("Datos cargados:", jsonData.length, "puntos");

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

            const pointId = point.Contador || index + 1;
            const imageIndex = pointId - 1; // Para mapear a 0.jpg - 149.jpg

            return {
              id: pointId, // Mantener el ID del punto (1-150)
              imageIndex: imageIndex, // Índice real de la imagen (0-149)
              name: `Image Location ${pointId}`, 
              coords: [lng, lat],
              lat: lat,
              lng: lng,
              safety: point.safety || 0, // <-- cambiar dataset propio
              image_id: point.image_id,
            };
          })
          .filter((point) => point !== null);
      } else {
        dataPoints = [
          { id: 1, imageIndex: 0, name: "Point 1", lat: -22.9068, lng: -43.1729, safety: 4.2 },
          { id: 2, imageIndex: 1, name: "Point 2", lat: -22.9168, lng: -43.1829, safety: 3.8 },
          { id: 3, imageIndex: 2, name: "Point 3", lat: -22.8968, lng: -43.1629, safety: 2.5 },
        ];
      }
    } catch (error) {
      dataPoints = [
        { id: 1, imageIndex: 0, name: "Point 1", lat: -22.9068, lng: -43.1729, safety: 4.2 },
        { id: 2, imageIndex: 1, name: "Point 2", lat: -22.9168, lng: -43.1829, safety: 3.8 },
        { id: 3, imageIndex: 2, name: "Point 3", lat: -22.8968, lng: -43.1629, safety: 2.5 },
      ];
    }
  }

  function initializeMap() {
    if (!mapContainer || !window.L) return;

    if (map) {
      map.remove();
    }

    map = window.L.map(mapContainer, {
      center: [-22.9068, -43.1729],
      zoom: 11,
      zoomControl: false, 
      attributionControl: false,
      scrollWheelZoom: true,
      wheelPxPerZoomLevel: 120, 
    });

    map.options.zoomSnap = 0.1; //manejo del zoom
    map.options.zoomDelta = 0.1;

    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "",
      maxZoom: 18,
    }).addTo(map);

    addMarkersToMap();
    fitMapToPoints(); //Para ajustar todos los puntos al inicio del mapa
  }

  function addMarkersToMap() {
    markers.forEach((marker) => map.removeLayer(marker));
    markers = [];

    dataPoints.forEach((point, index) => {
      const color = getSafetyColor(point.safety);
      const imagePath = base + `/assets/images/${point.imageIndex}.jpg`;

      const customIcon = window.L.divIcon({
  className: "custom-marker",
  html: `
    <div style="
      background-color: ${color};
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: black;
      font-weight: bold;
      font-size: 11px;
      line-height: 1;
    ">
      ${point.id}
    </div>
  `,
  iconSize: [34, 34],       // tamaño total del icono (28 + 2 * border de 3px)
  iconAnchor: [17, 17],     // punto central del icono
});


      const marker = window.L.marker([point.lat, point.lng], {
        icon: customIcon,
      }).addTo(map);

      const popupContent = `
      <div style="min-width: 250px; max-width: 300px;"> 
        <h3 style="margin: 0 0 10px 0; color: #000000;">${point.name}</h3> 
        <div style="margin-bottom: 15px; text-align: center;"> 
          <img src="${imagePath}" 
          alt="Image ${point.imageIndex}.jpg of point ${point.id}" 
          style="width: 100%; max-width: 250px; height: 150px; object-fit: cover; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.2); border: 2px solid ${color};" 
          onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" /> 
          <div style="display: none; padding: 20px; background: #f5f5f5; border-radius: 8px; color: #666;">📷 Image ${point.imageIndex}.jpg not available</div> 
        </div> 
        <p style="color: #000;"><strong style="color: #000;">Coordinates:</strong> ${point.lat.toFixed(4)}, ${point.lng.toFixed(4)}</p> 
        <p><strong style="color: #000;">Safety:</strong> <span style="color: ${color};">${point.safety?.toFixed(2) || "N/A"}</span></p>
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
  }

  function getSafetyColor(safety) {
    if (!safety) return "#808080";
    if (safety >= 7) return "#4CAF50"; // Verde
    if (safety >= 5) return "#FFC107"; // Amarillo
    return "#F44336"; // Rojo
  }

  function selectPoint(index) {
    if (index >= 0 && index < dataPoints.length) {
      selectedPoint = dataPoints[index];
      map.setView([selectedPoint.lat, selectedPoint.lng], 15);
      //currentImage.set(selectedPoint.id);
      markers.forEach((marker, i) => {
        if (i === index) {
          marker.openPopup();
        }
      });
    }
  }

  // function updateMapHighlight() {
  //   if (!map || markers.length === 0) return;
  //   const currentIndex = dataPoints.findIndex(
  //     (point) => point.id === $currentImage
  //   );
  //   if (currentIndex >= 0) {
  //     selectPoint(currentIndex);
  //   }
  // }

  function fitMapToPoints() {
    if (!map || dataPoints.length === 0) return;
    const group = new window.L.featureGroup(markers);
    map.fitBounds(group.getBounds().pad(0.1));
  }
</script>

<svelte:window
  on:resize={() => {
    if (map) {
      setTimeout(() => map.invalidateSize(), 100);
    }
  }}
/>

<div class="dashboard-container">
  <div class="dashboard">
    <div class="card map-section">
      <div class="card-header">
        <div class="card-icon">
          <MapIcon />
        </div>
        <div class="card-title">Perception Analytics - Dataset PlacePulse2</div>
      </div>
      
      <div class="map-container" bind:this={mapContainer}>
        <div class="map-overlay">
          <div class="map-controls">
            <button class="control-btn" on:click={fitMapToPoints}>📍 All Points</button>
          </div>
          
          <!-- Este bloque no va -->
          <!-- <div class="stats-overlay">
            <div class="stats-title">Loaded Data</div>
            <div class="stats-number">{dataPoints.length}</div>
            <div class="stats-subtitle">active points</div>
          </div> -->

        </div>

        <div class="safety-legend">
          <div class="legend-title">Safety Levels</div>
          <div class="legend-items">
            <div class="legend-item">
              <div class="legend-color" style="background-color: #4CAF50;"></div>
              <span class="legend-text">High (7+)</span>
            </div>
            <div class="legend-item">
              <div class="legend-color" style="background-color: #FFC107;"></div>
              <span class="legend-text">Medium (5-7)</span>
            </div>
            <div class="legend-item">
              <div class="legend-color" style="background-color: #F44336;"></div>
              <span class="legend-text">Low (0-5)</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- No se usará el Dataset Explorer -->
    <!-- <div class="card">
      <div class="card-header">
        <div class="card-icon">
          <DataBaseIcon />
        </div>
        <div class="card-title">Dataset Explorer</div>
      </div>
      
      <div class="slider-integration">
        <SliderTab />
      </div>
    </div> -->
    <!-- Eliminar este bloque -->

    <div class="card analytics-section">
      <div class="card-header">
        <div class="card-icon">
          <ChartIcon />
        </div>
        <div class="card-title">Perception Analytics - Brazil</div>
      </div>
      <div class="metrics-content">
        <SecurityMetrics />
      </div>
    </div>
  </div>
</div>

<style>
  .metrics-content {
    height: calc(100% - 60px);
    overflow: hidden;
  }

  .dashboard-container {
    width: 100%;
    color: #ffffff;
  }

  .dashboard {
    display: grid;
    grid-template-columns: 2fr 1fr;
    grid-template-rows: 1fr; 
    gap: 2rem;
    height: 100%;
  }

  .card {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    padding: 0.85rem;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
  }

  .card:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 35px rgba(102, 126, 234, 0.15);
  }

  .card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #667eea, #764ba2);
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .card-icon {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
  }

  .card-title {
    font-size: 1.1rem;
    font-weight: 600;
  }

  .map-section {
    grid-column: 1;
    grid-row: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .map-container {
    width: 100%;
    height: calc(100% - 80px);
    border-radius: 16px;
    position: relative;
    overflow: hidden;
    background: #2d3748;
  }

  .map-overlay {
    position: absolute;
    top: 20px;
    left: 20px;
    right: 20px;
    display: flex;
    justify-content: space-between;
    align-items: start;
    z-index: 1000;
    pointer-events: none;
  }

  .map-controls {
    display: flex;
    gap: 0.5rem;
    pointer-events: all;
  }

  .control-btn {
    padding: 0.6rem 1rem;
    background: rgba(0, 0, 0, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.8rem;
    backdrop-filter: blur(10px);
  }

  .control-btn:hover {
    background: rgba(102, 126, 234, 0.4);
  }

  .stats-overlay {
    background: rgba(0, 0, 0, 0.7);
    padding: 1rem;
    border-radius: 12px;
    backdrop-filter: blur(10px);
    text-align: center;
    pointer-events: all;
  }

  .stats-title {
    font-size: 0.8rem;
    opacity: 0.8;
    margin-bottom: 0.5rem;
  }

  .stats-number {
    font-size: 1.5rem;
    font-weight: 700;
  }

  .stats-subtitle {
    font-size: 0.7rem;
    opacity: 0.6;
  }

  .safety-legend {
    position: absolute;
    top: 20px; 
    right: 20px;
    background: rgba(0, 0, 0, 0.8);
    padding: 1rem;
    border-radius: 12px;
    backdrop-filter: blur(10px);
    z-index: 1000;
    min-width: 140px;
  }

  .legend-title {
    font-size: 0.9rem;
    font-weight: 600;
    color: white;
    margin-bottom: 0.8rem;
    text-align: center;
  }

  .legend-items {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  .legend-color {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 2px solid white;
    box-shadow: 0 1px 3px rgba(0,0,0,0.3);
  }

  .legend-text {
    font-size: 0.8rem;
    color: white;
    font-weight: 500;
  }

  .slider-integration {
    height: calc(100% - 60px);
    overflow: auto;
  }

  .slider-integration :global(.slider-section) {
    background: transparent;
    padding: 0;
    margin: 0;
    border: none;
    box-shadow: none;
    opacity: 1;
    transform: none;
  }

  .slider-integration :global(.slider-section h2) {
    display: none;
  }

  .slider-integration :global(.description) {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
    text-align: left;
    margin-bottom: 1rem;
  }

  .slider-integration :global(.controls-section) {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.05);
    padding: 1rem;
  }

  .slider-integration :global(.image-container) {
    max-height: 100px;
  }

  .slider-integration :global(.main-image) {
    max-height: 250px;
  }

  .analytics-section {
    grid-column: 2; 
    grid-row: 1; 
    height: 100%; 
    flex-direction: column;
  }

  :global(.leaflet-container) {
    font-family: inherit;
    height: 100%;
    width: 100%;
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

  :global(.leaflet-control-zoom) {
    display: none !important;
  }
</style>