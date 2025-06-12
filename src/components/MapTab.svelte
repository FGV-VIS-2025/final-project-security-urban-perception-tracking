<script>
  import { onMount, onDestroy } from "svelte";
  import { base } from "$app/paths";
  import MapIcon from "../lib/Icons/MapIcon.svelte";
  import { selectedMapPoint } from '../stores/appStore.js';
  import ScatterPlot from "./InteractiveMap/ScatterPlot.svelte";

  let mapContainer;
  let map;
  let markers = [];
  let mounted = false;
  let selectedPoint = null;
  let dataPoints = [];
  let jsonData = {};

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
      const response = await fetch(base + "/data_hololens.json");
      if (response.ok) {
        jsonData = await response.json();

        dataPoints = Object.entries(jsonData)
          .map(([key, point]) => {
            const lat = point.lat;
            const lng = point.long;

            if (isNaN(lat) || isNaN(lng) || lat === null || lng === null) {
              console.warn(`Punto ${key} tiene coordenadas inválidas:`, {
                lat,
                lng,
                point,
              });
              return null;
            }

            if (lat < -23.5 || lat > -22.0 || lng < -44.0 || lng > -43.0) {
              console.warn(`Punto ${key} fuera del rango de Río:`, {
                lat,
                lng,
              });
            }

            const pointId = parseInt(key) + 1;
            const imageIndex = parseInt(key); 

            return {
              id: pointId, 
              imageIndex: imageIndex,
              name: `Image Location ${pointId}`, 
              coords: [lng, lat],
              lat: lat,
              lng: lng,
              safety_hololens: point.avg_hololens || 0,
              safety_pp2: point.avg_pp2 || 0,
              image_id: point.ID,
              score_participants: point.score_participant || []
            };
          })
          .filter((point) => point !== null);

        console.log("Puntos procesados:", dataPoints.length);
      } else {
        console.error("Error loading data_hololens.json:", response.statusText);
        dataPoints = [
          { id: 1, imageIndex: 0, name: "Point 1", lat: -22.9068, lng: -43.1729, safety_hololens: 4.2, safety_pp2: 3.3 },
        ];
      }
    } catch (error) {
      console.error("Error loading data_hololens.json:", error);
      dataPoints = [
        { id: 1, imageIndex: 0, name: "Point 1", lat: -22.9068, lng: -43.1729, safety_hololens: 4.2, safety_pp2: 3.3 },
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

    map.options.zoomSnap = 0.1;
    map.options.zoomDelta = 0.1;

    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "",
      maxZoom: 18,
    }).addTo(map);

    addMarkersToMap();
    fitMapToPoints();
  }

  function addMarkersToMap() {
    if (!map || dataPoints.length === 0) return;

    markers.forEach((marker) => map.removeLayer(marker));
    markers = [];

    dataPoints.forEach((point, index) => {
      const color = getSafetyColor(point.safety_hololens);
      const imagePath = base + `/assets/images/${point.imageIndex}.jpg`;

      const customIcon = window.L.divIcon({
        className: "custom-marker",
        html: `
          <div style="
            background-color: ${color};
            width: 32px;
            height: 32px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 3px 8px rgba(0,0,0,0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 12px;
            line-height: 1;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
          ">
            ${point.id}
          </div>
        `,
        iconSize: [38, 38],
        iconAnchor: [19, 19],
      });

      const marker = window.L.marker([point.lat, point.lng], {
        icon: customIcon,
      }).addTo(map);

      const hololensColor = getSafetyColor(point.safety_hololens);
      const pp2Color = getSafetyColor(point.safety_pp2);

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
          <p><strong style="color: #000;">Safety Score (HoloLens):</strong> <span style="color: ${hololensColor};">${point.safety_hololens?.toFixed(1) || "N/A"}</span></p>
          <p><strong style="color: #000;">Safety Score (PlacePulse2):</strong> <span style="color: ${pp2Color};">${point.safety_pp2?.toFixed(1) || "N/A"}</span></p>
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
    if (!safety || isNaN(safety)) return "#808080";
    if (safety >= 7) return "#4CAF50"; // Verde
    if (safety >= 5) return "#FFC107"; // Amarillo
    return "#F44336"; // Rojo
  }

  function selectPoint(index) {
    if (index >= 0 && index < dataPoints.length) {
      selectedPoint = dataPoints[index];
      map.setView([selectedPoint.lat, selectedPoint.lng], 15);
      markers.forEach((marker, i) => {
        if (i === index) {
          marker.openPopup();
        }
      });

      selectedMapPoint.set(selectedPoint);
    }
  }

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
        <div class="card-title">Perception Analytics - GeoSpatial Analysis</div>
      </div>
      
      <div class="map-container" bind:this={mapContainer}>
        <div class="map-overlay">
          <div class="map-controls">
            <button class="control-btn" on:click={fitMapToPoints}>📍 All Points</button>
          </div>
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

    
    <ScatterPlot data={dataPoints}/>

    <div class="card additional-section">
      <div class="additional-header">
        <div class="additional-icon">🔍</div>
        <div class="additional-title">Additional Analysis</div>
      </div>
      
      <div class="additional-content">
        <div class="placeholder-content">
          <div class="placeholder-icon">⚙️</div>
          <div class="placeholder-text">Additional Component</div>
          <div class="placeholder-subtext">This space is for another component</div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .dashboard-container {
    width: 100%; 
    height: 101vh; /**********************************************/
    color: #ffffff;
  }

  .dashboard {
    display: grid;
    grid-template-columns: 1.5fr 1fr; 
    grid-template-rows: 1fr 0.55fr;
    gap: 0.5rem;
    height: 100%;
    grid-template-areas: 
      "map scatterplot"
      "map additional";
  }

  .map-section {
    grid-area: map;
  }

  .additional-section {
    grid-area: additional;
  }

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
  }

  .card:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
  }

  .card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
  }

  .card-header, .additional-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .card-icon, .additional-icon {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }

  .card-title, .additional-title {
    font-size: 1.3rem;
    font-weight: 700;
    color: #2d3748;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  .map-section {
    height: 100%;
  }

  .map-container {
    width: 100%;
    height: calc(100% - 100px);
    border-radius: 16px;
    position: relative;
    overflow: hidden;
    background: #ffffff;
    border: 2px solid rgba(102, 126, 234, 0.2);
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .additional-content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f8fafc;
    border-radius: 16px;
    border: 2px solid rgba(102, 126, 234, 0.2);
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  .placeholder-content {
    text-align: center;
    color: #64748b;
  }

  .placeholder-icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }

  .placeholder-text {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #475569;
  }

  .placeholder-subtext {
    font-size: 0.85rem;
    color: #64748b;
  }

  .map-overlay {
    position: absolute;
    top: 16px;
    left: 16px;
    right: 16px;
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
    padding: 0.75rem 1.25rem;
    background: rgba(255, 255, 255, 0.95);
    border: 2px solid rgba(102, 126, 234, 0.3);
    border-radius: 12px;
    color: #2d3748;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.9rem;
    font-weight: 600;
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .control-btn:hover {
    background: rgba(102, 126, 234, 0.9);
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
  }

  .safety-legend {
    position: absolute;
    top: 16px; 
    right: 16px;
    background: rgba(255, 255, 255, 0.95);
    padding: 1.25rem;
    border-radius: 16px;
    backdrop-filter: blur(10px);
    z-index: 1000;
    min-width: 160px;
    border: 2px solid rgba(102, 126, 234, 0.2);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }

  .legend-title {
    font-size: 1rem;
    font-weight: 700;
    color: #2d3748;
    margin-bottom: 1rem;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .legend-items {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .legend-color {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  }

  .legend-text {
    font-size: 0.9rem;
    color: #2d3748;
    font-weight: 600;
  }

  :global(.leaflet-container) {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    height: 100% !important;
    width: 100% !important;
    background: #f8fafc !important;
    border-radius: 16px;
  }

  :global(.leaflet-tile-pane) {
    opacity: 1 !important;
  }

  :global(.leaflet-map-pane) {
    z-index: 1 !important;
  }

  :global(.leaflet-popup-content) {
    margin: 12px 16px;
    line-height: 1.5;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  }

  :global(.leaflet-popup-content h3) {
    margin: 0 0 12px 0;
    font-weight: 700;
  }

  :global(.leaflet-popup-content-wrapper) {
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  }

  :global(.leaflet-popup-tip) {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  :global(.custom-marker) {
    background: transparent !important;
    border: none !important;
  }

  :global(.leaflet-control-zoom) {
    display: none !important;
  }

  :global(.leaflet-control-attribution) {
    display: none !important;
  }

  :global(.leaflet-container.leaflet-touch-zoom) {
    opacity: 1 !important;
    visibility: visible !important;
  }

  :global(.leaflet-tile) {
    opacity: 1 !important;
  }
</style>