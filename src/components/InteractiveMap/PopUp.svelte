<script>
    import { base } from "$app/paths";

    export let point;
    export let color;
    export let hololensColor;
    export let pp2Color;

    $: imagePath = base + `/assets/images/${point.imageIndex}.jpg`;
    $: scoreData = processScoreData(point.score_participants || []);
    $: countryData = processCountryData(point.score_participants || []);

    let barPositions = {};

    function processScoreData(participants) {
        const scoreCounts = {};
        participants.forEach(p => {
            scoreCounts[p.score] = (scoreCounts[p.score] || 0) + 1;
        });

        return Object.entries(scoreCounts)
            .map(([score, count]) => ({ score: parseInt(score), count }))
            .sort((a, b) => a.score - b.score);
    }

    function processCountryData(participants) {
        const countryCounts = {};
        participants.forEach(p => {
            let country;
            if (p.state.includes('Brasil')) {
                country = 'Brazil';
            } else if (p.state === 'Peru') {
                country = 'Peru';
            } else if (p.state === 'Paraguai') {
                country = 'Paraguay';
            } else {
                country = 'Other';
            }
            countryCounts[country] = (countryCounts[country] || 0) + 1;
        });

        return Object.entries(countryCounts)
            .map(([country, count]) => ({ country, count }))
            .sort((a, b) => b.count - a.count);
    }

    function handleImageError(event) {
        event.target.style.display = "none";
        event.target.nextElementSibling.style.display = "block";
    }

    function getBarWidth(value, maxValue) {
        // Cambié de 100 a 150 para hacer las barras más largas
        // También aumenté el mínimo de 5 a 10 para barras más visibles
        return Math.max((value / maxValue) * 150, 10);
    }

    function handleMouseMove(event, score) {
        barPositions = { ...barPositions, [score]: event.clientX };
    }
</script>

<div class="popup-content">
    <div class="info-section">
        <h3 class="popup-title">{point.name}</h3>
        <img
            src={imagePath}
            alt="Image {point.imageIndex}.jpg of point {point.id}"
            class="popup-image"
            style="border: 2px solid {color};"
            on:error={handleImageError}
        />

        <p class="info-item">
            <strong>Coordinates:</strong>
            {point.lat.toFixed(4)}, {point.lng.toFixed(4)}
        </p>

        <p class="info-item">
            <strong>Safety Score (HoloLens):</strong>
            <span style="color: {hololensColor};">
                {point.safety_hololens?.toFixed(1) || "N/A"}
            </span>
        </p>

        <p class="info-item">
            <strong>Safety Score (PlacePulse2):</strong>
            <span style="color: {pp2Color};">
                {point.safety_pp2?.toFixed(1) || "N/A"}
            </span>
        </p>
    </div>

    <div class="info-section">
        {#if scoreData.length > 0}
            <div class="chart-section">
                <h4 class="chart-title">Score Distribution</h4>
                <div class="chart-container">
                    {#each scoreData as item}
                        <div class="bar-item">
                            <div class="bar-label">Score {item.score}</div>
                            <div class="bar-container">
                                <div
                                    class="bar score-bar"
                                    style="width: {getBarWidth(item.count, Math.max(...scoreData.map(d => d.count)))}%;"
                                    on:mousemove={(e) => handleMouseMove(e, item.score)}
                                ></div>
                                <span class="bar-value">{item.count}</span>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        {/if}

        {#if countryData.length > 0}
            <div class="chart-section">
                <h4 class="chart-title">Participants by Country</h4>
                <div class="chart-container">
                    {#each countryData as item}
                        <div class="bar-item">
                            <div class="bar-label">{item.country}</div>
                            <div class="bar-container">
                                <div
                                    class="bar country-bar"
                                    style="width: {getBarWidth(item.count, Math.max(...countryData.map(d => d.count)))}%"
                                ></div>
                                <span class="bar-value">{item.count}</span>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        {/if}
    </div>
</div>

<style>
    .popup-content {
        width: 100%;
        display: flex;
        gap: 16px;
    }
    
    .popup-title {
        color: #000000;
        font-weight: 700;
        font-size: 1rem;
    }
    
    .popup-image {
        width: 100%;
        max-width: 200px;
        object-fit: cover;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        transition: transform 0.2s ease;
    }
    
    .popup-image:hover {
        transform: scale(1.02);
    }
    
    .info-section {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
    
    .info-item {
        color: #000;
        margin: 0;
        font-size: 0.75rem;
    }
    
    .info-item strong {
        color: #000;
        font-weight: 600;
    }
    
    .chart-section {
        padding: 5px;
        border-radius: 8px;
        border: 1px solid #e9ecef;
    }
    
    .chart-title {
        margin: 0 0 10px 0;
        color: #000;
        font-weight: 600;
        font-size: 0.95rem;
    }
    
    .chart-container {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }
    
    .bar-item {
        display: flex;
        align-items: center;
        font-size: 0.85rem;
    }
    
    .bar-label {
        min-width: 70px;
        color: #333;
        font-weight: 500;
        text-align: left;
    }
    
    .bar-container {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 8px;
        position: relative;
        min-width: 140px;
    }
    
    .bar {
        height: 20px;
        border-radius: 4px;
        transition: all 0.3s ease;
        min-width: 10px; /* Aumenté de 8px a 10px */
    }
    
    .score-bar {
        background: linear-gradient(90deg, #4f46e5, #7c3aed);
        box-shadow: 0 2px 4px rgba(79, 70, 229, 0.2);
    }
    
    .country-bar {
        background: linear-gradient(90deg, #059669, #10b981);
        box-shadow: 0 2px 4px rgba(5, 150, 105, 0.2);
    }
    
    .bar:hover {
        transform: scaleY(1.1);
        filter: brightness(1.1);
    }
    
    .bar-value {
        color: #333;
        font-weight: 600;
        font-size: 0.8rem;
        min-width: 20px;
    }
</style>