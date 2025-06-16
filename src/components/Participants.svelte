<script>
    import { onMount, onDestroy } from 'svelte';
    import * as d3 from 'd3';
    import { base } from "$app/paths";

    // --- Component State ---
    let participants = [];
    let southAmericaGeoJSON = null;

    // Referencias SVG y elementos DOM
    let dotMatrixSvgElement;
    let mapSvgElement;
    let dotMatrixPanelElement; // Para posicionar el tooltip de la matriz de puntos
    let mapPanelElement;       // Para posicionar el tooltip del mapa

    // --- Dot Matrix Configuration ---
    const dotRadius = 15;
    const dotSpacing = 5;
    const dotNumCols = 5;
    const dotNumRows = 6;
    const totalDots = dotNumCols * dotNumRows; // Esto asegura que solo se muestren 30 puntos
    let dotMatrixWidth;
    let dotMatrixHeight;

    // --- Dot Matrix Tooltip State ---
    let showDotMatrixTooltip = false;
    let dotMatrixTooltipContent = {};
    let dotMatrixTooltipX = 0;
    let dotMatrixTooltipY = 0;

    // --- Map Configuration (Sudamérica) ---
    const mapWidth = 800;
    const mapHeight = 500;
    let countryData = []; // Datos agregados por país

    // --- Map Tooltip State (gestionado por Svelte) ---
    let showMapTooltip = false;
    let mapTooltipContent = {};
    let mapTooltipX = 0;
    let mapTooltipY = 0;

    // Declaraciones de escalas de color y mapas fuera de las funciones de dibujo
    let colorScaleMap;
    let countryCountsMapGlobal;

    // --- Data Loading ---
    onMount(async () => {
        try {
            const participantsPath = `${base}/Participants.json`;
            const southAmericaGeoJSONPath = `${base}/country_participants.geojson`;

            // 1. Load Participant Data
            participants = await d3.json(participantsPath);
            dotMatrixWidth = dotNumCols * (2 * dotRadius + dotSpacing) - dotSpacing;
            dotMatrixHeight = dotNumRows * (2 * dotRadius + dotSpacing) - dotSpacing;

            // 2. Load South America GeoJSON
            southAmericaGeoJSON = await d3.json(southAmericaGeoJSONPath);

            // 3. Aggregate Participant Data by Country
            const countryCounts = new Map();
            participants.forEach(p => {
                const country = normalizeCountryName(p.Country);
                if (country) {
                    countryCounts.set(country, (countryCounts.get(country) || 0) + 1);
                }
            });
            countryData = Array.from(countryCounts, ([country, count]) => ({
                country: country,
                count: count
            }));

            // 4. No longer initializing mapTooltip with D3 here

            // 5. Configurar la escala de color y el mapa de conteos aquí
            const maxCount = d3.max(countryData, d => d.count) || 1;
            const minCount = d3.min(countryData, d => d.count) || 0;
            const colorDomain = (minCount === maxCount && maxCount === 0) ? [0, 1] : [minCount, maxCount];
            colorScaleMap = d3.scaleSequential(d3.interpolateReds).domain(colorDomain);
            countryCountsMapGlobal = new Map(countryData.map(d => [d.country, d.count]));

        } catch (error) {
            console.error("Error loading data:", error);
        }
    });

    // --- Reactive Declarations ---
    $: if (dotMatrixSvgElement && participants.length > 0 && countryCountsMapGlobal && colorScaleMap) {
        const displayedParticipants = participants.slice(0, totalDots);
        drawDotMatrix(displayedParticipants, countryCountsMapGlobal, colorScaleMap);
    }

    $: if (countryData.length > 0 && southAmericaGeoJSON && mapSvgElement && countryCountsMapGlobal && colorScaleMap) {
        drawSouthAmericaMap(countryCountsMapGlobal, colorScaleMap);
    }

    // Limpiando (no es necesario para Svelte tooltips, pero mantiene consistencia si se cambia de nuevo)
    onDestroy(() => {
        // No hay d3.select("body").append("div") para remover si el tooltip es Svelte
    });

    // --- Dot Matrix Drawing Function ---
    function drawDotMatrix(data, countryCountsMap, colorScale) {
        if (!dotMatrixSvgElement || !countryCountsMap || !colorScale) {
            console.warn("drawDotMatrix: Missing or invalid essential data for drawing dot matrix.");
            return;
        }

        const svg = d3.select(dotMatrixSvgElement)
            .attr("width", dotMatrixWidth)
            .attr("height", dotMatrixHeight);

        svg.selectAll("circle").remove();

        svg.selectAll("circle")
            .data(data)
            .join("circle")
            .attr("cx", (d, i) => (i % dotNumCols) * (2 * dotRadius + dotSpacing) + dotRadius)
            .attr("cy", (d, i) => Math.floor(i / dotNumCols) * (2 * dotRadius + dotSpacing) + dotRadius)
            .attr("r", dotRadius)
            .attr("stroke", "white")
            .attr("stroke-width", 1)
            .attr("fill", d => {
                const normalizedCountry = normalizeCountryName(d.Country);
                const count = countryCountsMap.get(normalizedCountry) || 0;
                return colorScale(count);
            })
            .on("mouseover", function(event, d) {
                showDotMatrixTooltip = true;
                const panelRect = dotMatrixPanelElement.getBoundingClientRect();
                dotMatrixTooltipX = event.clientX - panelRect.left + 15;
                dotMatrixTooltipY = event.clientY - panelRect.top + 15;

                dotMatrixTooltipContent = {
                    "Participant": d.Participant,
                    "Country": d.Country,
                    "Neighborhood": d.Neighborhood || "N/A",
                    "Age": d.Age,
                    "Academic level": d.Academic_level,
                    "Sex": d.Sex
                };
            })
            .on("mouseout", function() {
                showDotMatrixTooltip = false;
            });
    }

    // --- South America Map Drawing Function ---
    function drawSouthAmericaMap(countryCountsMap, colorScale) {
        if (!mapSvgElement || !southAmericaGeoJSON || !southAmericaGeoJSON.features ||
            southAmericaGeoJSON.features.length === 0 || !Array.isArray(countryData) || !countryCountsMap || !colorScale) {
            console.warn("drawSouthAmericaMap: Missing or invalid essential data for drawing map.");
            return;
        }

        const svg = d3.select(mapSvgElement)
            .attr("width", mapWidth)
            .attr("height", mapHeight);

        svg.selectAll("*").remove();

        // Fondo del mapa
        svg.append("rect")
            .attr("width", mapWidth)
            .attr("height", mapHeight)
            .attr("fill", "#333366");

        // Configurando proyección para Sudamérica utilizando fitSize
        const projection = d3.geoMercator();
        const pathGenerator = d3.geoPath().projection(projection);
        projection.fitSize([mapWidth, mapHeight], southAmericaGeoJSON);

        // Dibujar países
        svg.selectAll("path")
            .data(southAmericaGeoJSON.features)
            .join("path")
            .attr("d", pathGenerator)
            .attr("fill", d => {
                const countryName = normalizeCountryName(d.properties.sovereignt);
                const count = countryCountsMap.get(countryName);
                const originalColor = count !== undefined ? colorScale(count) : "#ccc";
                d.originalFill = originalColor; // Guarda el color original para mouseout
                return originalColor;
            })
            .attr("stroke", "#fff")
            .attr("stroke-width", 0.5)
            .on("mouseover", function(event, d) {
                const countryName = normalizeCountryName(d.properties.sovereignt);
                const count = countryCountsMap.get(countryName) || 0;

                d3.select(this)
                    .attr("stroke", "white")
                    .attr("stroke-width", 2);

                // --- Actualizar estado de Svelte para el tooltip del mapa ---
                showMapTooltip = true;
                const panelRect = mapPanelElement.getBoundingClientRect();
                mapTooltipX = event.clientX - panelRect.left + 15;
                mapTooltipY = event.clientY - panelRect.top + 15;

                mapTooltipContent = {
                    "Country": countryName,
                    "Participants": count
                };
            })
            .on("mouseout", function(event, d) {
                d3.select(this)
                    .attr("fill", d.originalFill)
                    .attr("stroke", "#fff")
                    .attr("stroke-width", 0.5);

                // --- Ocultar tooltip del mapa de Svelte ---
                showMapTooltip = false;
            });

        // --- Añadir leyenda (Vertical y en un cuadro) ---
        const legendRectWidth = 20;
        const legendRectHeight = 120;
        const legendPadding = 10;
        const legendTitleOffset = 10;
        const axisLabelOffset = 5;

        // Calcula el rango de conteos para la leyenda
        const maxCount = d3.max(countryData, d => d.count) || 1;
        const minCount = d3.min(countryData, d => d.count) || 0;
        
        const legendScale = d3.scaleLinear()
            .domain([minCount, maxCount])
            .range([legendRectHeight, 0]);

        // Calcula los puntos para el gradiente
        const numStops = 5;
        const legendData = Array.from({length: numStops}, (_, i) =>
            minCount + (maxCount - minCount) * (i / (numStops - 1)));

        // --- Ajuste para el ancho y alto del cuadro de la leyenda ---
        const legendGroupWidth = 170;
        // Aumentar la altura para dar más margen y facilitar el centrado.
        const legendGroupHeight = legendRectHeight + 80; // Aumentado a 80.

        // Posicionamiento del grupo principal de la leyenda (dentro del mapa)
        const legendX = mapWidth - legendGroupWidth - 20;
        const legendY = 20;
        
        const legend = svg.append("g")
            .attr("transform", `translate(${legendX}, ${legendY})`);

        // --- Cuadro de la leyenda ---
        legend.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", legendGroupWidth)
            .attr("height", legendGroupHeight)
            .attr("fill", "rgba(0,0,0,0.4)")
            .attr("stroke", "white")
            .attr("stroke-width", 1)
            .attr("rx", 5)
            .attr("ry", 5);

        // Título de la leyenda
        legend.append("text")
            .text("Participants by Country")
            .attr("x", legendPadding + 5)
            .attr("y", legendPadding + legendTitleOffset)
            .attr("fill", "white")
            .attr("font-size", "12px")
            .attr("font-weight", "bold");

        // --- Centrar la barra y el eje ---
        // Calcula el alto que ocupa el título y el padding superior.
        // Asume un tamaño de fuente de 12px para el título y un padding de 10px.
        // La altura efectiva del título + su offset + padding.
        const titleEffectiveHeight = legendTitleOffset + 12 + 5; // Altura del título (aprox. 12px) + offset + un pequeño margen

        // El punto de inicio vertical para la barra y el eje dentro del grupo de la leyenda.
        // Esto es el 'y' donde empieza el contenido centrado.
        const contentStartY = legendPadding + titleEffectiveHeight;

        // Altura total del espacio disponible para la barra y el eje.
        // Es la altura del cuadro de la leyenda, menos el padding inferior y el espacio ocupado por el título y su padding.
        const availableHeightForBarAndAxis = legendGroupHeight - contentStartY - legendPadding;

        // La altura combinada de la barra de color y el eje.
        // El eje puede ser un poco más alto que solo las etiquetas (ej. por la línea de dominio que luego se remueve).
        const estimatedAxisHeight = 30; // Una estimación más generosa para el eje, que incluye labels y tick marks.
        const combinedHeightOfBarAndAxis = legendRectHeight + estimatedAxisHeight;

        // Calcular el offset para centrar el bloque (barra + eje) dentro del espacio disponible.
        const verticalCenterOffset = (availableHeightForBarAndAxis - combinedHeightOfBarAndAxis) / 2;

        // Definición del gradiente vertical
        const defs = svg.append("defs");
        const gradient = defs.append("linearGradient")
            .attr("id", "legend-gradient")
            .attr("x1", "0%")
            .attr("x2", "0%")
            .attr("y1", "100%")
            .attr("y2", "0%");

        gradient.selectAll("stop")
            .data(legendData)
            .enter().append("stop")
            .attr("offset", (d, i) => `${(i / (numStops - 1)) * 100}%`)
            .attr("stop-color", d => colorScale(d));

        // Rectángulo que muestra el gradiente
        legend.append("rect")
            .attr("x", legendPadding + 5)
            .attr("y", contentStartY + verticalCenterOffset)
            .attr("width", legendRectWidth)
            .attr("height", legendRectHeight)
            .style("fill", "url(#legend-gradient)");

        // Eje de la leyenda (vertical, a la derecha de la barra de color)
        const legendAxis = d3.axisRight(legendScale)
            .ticks(5)
            .tickSize(4)
            .tickFormat(d3.format(".0f"));

        legend.append("g")
            .attr("transform", `translate(${legendPadding + 5 + legendRectWidth + axisLabelOffset}, ${contentStartY + verticalCenterOffset})`)
            .call(legendAxis)
            .selectAll("text")
            .attr("fill", "white")
            .attr("font-size", "10px");

        // Remover líneas de dominio y ticks para una apariencia más limpia (opcional)
        legend.select(".domain").remove();
        legend.selectAll(".tick line").attr("stroke", "white");

        console.log("South America map drawn successfully.");
    }

    // Función para normalizar nombres de países
    function normalizeCountryName(name) {
        if (!name) return "";

        const cleanedName = name.trim().toLowerCase();

        const countryMap = {
            "argentina": "Argentina",
            "bolivia": "Bolivia",
            "brasil": "Brasil",
            "brazil": "Brasil",
            "chile": "Chile",
            "colombia": "Colombia",
            "ecuador": "Ecuador",
            "guyana": "Guyana",
            "paraguay": "Paraguay",
            "peru": "Perú",
            "suriname": "Surinam",
            "uruguay": "Uruguay",
            "venezuela": "Venezuela",
            "french guiana": "Guayana Francesa",
        };

        return countryMap[cleanedName] || name;
    }
</script>

<style>
    /* Estilos generales del contenedor */
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px;
        background-color: #282c34;
        color: white;
        font-family: Arial, sans-serif;
        min-height: 100vh;
        box-sizing: border-box;
    }

    h1 {
        color: #61dafb;
        margin-bottom: 10px;
    }

    p {
        color: #f0f0f0;
        margin-top: 5px;
        margin-bottom: 20px;
    }

    /* Contenedor de las visualizaciones */
    .visualizations-wrapper {
        display: flex;
        justify-content: center;
        gap: 30px;
        width: 100%;
        max-width: 1600px;
        flex-wrap: wrap;
    }

    /* Estilo para cada panel de visualización */
    .visualization-panel {
        background-color: #3a3f4a;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        padding: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative; /* Necesario para posicionar el tooltip de la matriz y el mapa */
        margin-bottom: 20px;
    }

    .visualization-panel svg {
        margin-top: 10px;
    }

    /* --- ESTILO UNIFICADO PARA AMBOS TOOLTIPS --- */
    .tooltip {
        position: absolute;
        background-color: rgba(0, 0, 0, 0.85);
        color: white;
        padding: 10px;
        border-radius: 5px;
        pointer-events: none;
        box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
        z-index: 1000;
        text-align: left;
        font-size: 1.0em;
        line-height: 1.4;
        white-space: nowrap; /* Esto es clave para que el texto no se rompa y el ancho se ajuste al contenido más largo */
        display: inline-block; /* Permite que el ancho se ajuste al contenido */
    }

    .tooltip p {
        margin: 0;
        color: white;
        font-style: normal;
    }

    .tooltip strong {
        color: #ffda47;
    }
</style>

<div class="container">
    <h1>PARTICIPANT INFORMATION</h1>
    <p>A dot represents one participant</p>

    <div class="visualizations-wrapper">
        <div class="visualization-panel" bind:this={dotMatrixPanelElement}>
            <p>>> Hover over a dot for personal information</p>
            <svg bind:this={dotMatrixSvgElement}></svg>
            {#if showDotMatrixTooltip}
                <div class="tooltip" style="left: {dotMatrixTooltipX}px; top: {dotMatrixTooltipY}px;">
                    {#each Object.entries(dotMatrixTooltipContent) as [key, value]}
                        <p><strong>{key}:</strong> {value}</p>
                    {/each}
                </div>
            {/if}
        </div>

        <div class="visualization-panel map-container" bind:this={mapPanelElement}>
            <p>>> Hover over a country to view participant information</p>
            <svg bind:this={mapSvgElement}></svg>
            {#if showMapTooltip}
                <div class="tooltip" style="left: {mapTooltipX}px; top: {mapTooltipY}px;">
                    {#each Object.entries(mapTooltipContent) as [key, value]}
                        <p><strong>{key}:</strong> {value}</p>
                    {/each}
                </div>
            {/if}
        </div>
    </div>
</div>