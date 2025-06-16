<script>
    import { base } from "$app/paths";

    export let point;
    export let color;
    export let hololensColor;
    export let pp2Color;

    $: imagePath = base + `/assets/images/${point.imageIndex}.jpg`;

    function handleImageError(event) {
        event.target.style.display = "none";
        event.target.nextElementSibling.style.display = "block";
    }
</script>

<div class="popup-content">
    <h3 class="popup-title">{point.name}</h3>

    <div class="image-container">
        <img
            src={imagePath}
            alt="Image {point.imageIndex}.jpg of point {point.id}"
            class="popup-image"
            style="border: 2px solid {color};"
            on:error={handleImageError}
        />
        <div class="image-fallback">
            📷 Image {point.imageIndex}.jpg not available
        </div>
    </div>

    <div class="info-section">
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
</div>

<style>
    .popup-content {
        min-width: 250px;
        max-width: 300px;
        font-family:
            "Inter",
            -apple-system,
            BlinkMacSystemFont,
            sans-serif;
    }

    .popup-title {
        margin: 0 0 10px 0;
        color: #000000;
        font-weight: 700;
        font-size: 1.1rem;
    }

    .image-container {
        margin-bottom: 15px;
        text-align: center;
        position: relative;
    }

    .popup-image {
        width: 100%;
        max-width: 250px;
        height: 150px;
        object-fit: cover;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        transition: transform 0.2s ease;
    }

    .popup-image:hover {
        transform: scale(1.02);
    }

    .image-fallback {
        display: none;
        padding: 20px;
        background: #f5f5f5;
        border-radius: 8px;
        color: #666;
        font-size: 0.9rem;
    }

    .info-section {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .info-item {
        color: #000;
        margin: 0;
        font-size: 0.9rem;
        line-height: 1.4;
    }

    .info-item strong {
        color: #000;
        font-weight: 600;
    }
</style>
