<script>
    import ChartIcon from "../../lib/Icons/ChartIcon.svelte";
    import SecurityMetrics  from "./SecurityMetrics.svelte";

</script>

<div class="card analytics-section">
    <div class="card-header">
        <div class="card-icon">
            <ChartIcon />
        </div>
        <div class="card-title">Perception Analytics - Brazil</div>
    </div>
</div>

<style>
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
        content: "";
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

    .analytics-section {
        grid-column: 2;
        grid-row: 1;
        height: 100%;
        flex-direction: column;
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

    .metrics-content {
        height: calc(100% - 60px);
        overflow: hidden;
    }
</style>
