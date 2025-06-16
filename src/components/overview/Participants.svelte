<script>
    import { onMount, onDestroy } from 'svelte';
    import * as d3 from 'd3';
    import { base } from "$app/paths";

    let participants = [];
    let southAmericaGeoJSON = null;

    let dotMatrixSvgElement;
    let mapSvgElement;
    let dotMatrixPanelElement; 
    let mapPanelElement;      

    const dotRadius = 15;
    const dotSpacing = 5;
    const dotNumCols = 5;
    const dotNumRows = 6;
    const totalDots = dotNumCols * dotNumRows; 
    let dotMatrixWidth;
    let dotMatrixHeight;

    let showDotMatrixTooltip = false;
    let dotMatrixTooltipContent = {};
    let dotMatrixTooltipX = 0;
    let dotMatrixTooltipY = 0;

    const mapWidth = 800;
    const mapHeight = 500;
    let countryData = []; // Datos agregados por país

    let showMapTooltip = false;
    let mapTooltipContent = {};
    let mapTooltipX = 0;
    let mapTooltipY = 0;

    let colorScaleMap;
    let countryCountsMapGlobal;

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
            .attr("fill", "transparent");

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

        const numStops = 5;

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

<style>
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px;
        color: white;
        box-sizing: border-box;
        padding-top: 130px;
    }

    p {
        color: #f0f0f0;
        margin-top: 5px;
        margin-bottom: 20px;
    }

    .visualizations-wrapper {
        display: flex;
        justify-content: center;
        gap: 30px;
        width: 100%;
        max-width: 1600px;
        flex-wrap: wrap;
    }

    .visualization-panel {
        border-radius: 8px;
        padding: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        margin-bottom: 20px;
    }

    .visualization-panel svg {
        margin-top: 10px;
    }

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
        white-space: nowrap; 
        display: inline-block; 
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

