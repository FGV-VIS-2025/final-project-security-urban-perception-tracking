<script>
    import { onMount, afterUpdate } from "svelte";
    import ChartIcon from "../../lib/Icons/ChartIcon.svelte";

    export let data = [];
    export let selectedPointId = null;

    let mounted = false; 

    $: if (mounted && data && data.length > 0) {
        console.log(data);
    }

    $: if (mounted && selectedPointId !== null) {
        console.log(selectedPointId);
    }

    onMount(() => {
        mounted = true;
    });
</script>

<div class="card additional-section">
    <div class="additional-header">
        <div class="additional-icon"><ChartIcon /></div>
        <div class="additional-title">Additional Analysis</div>
    </div>

    <div class="additional-content">
        <div class="placeholder-content">
            <div class="placeholder-icon">⚙️ IN-PROGRESS</div>
            <div class="placeholder-text">
                {#if data.length > 0}
                    {JSON.stringify(data[0])}
                {:else}
                    No data available
                {/if}
            </div>
            <div class="placeholder-subtext">
                This space is for another component
            </div>
        </div>
    </div>
</div>

<style>
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

    .additional-header {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        margin-bottom: 0.5rem;
    }

    .additional-icon {
        width: 36px;
        height: 36px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .additional-title {
        font-size: 1rem;
        font-weight: 500;
        color: #2d3748;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
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
        color: #2d3748;
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
</style>
