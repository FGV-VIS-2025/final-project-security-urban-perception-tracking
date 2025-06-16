<script>
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import { onMount } from 'svelte';

  onMount(() => {
    const targetPath = base ? `${base}/overview` : '/overview';
    goto(targetPath, { replaceState: true });
  });
</script>

<!-- Opcionalmente puedes mostrar un loading mientras redirige -->
<div class="loading-redirect">
  <p>Redirecting to overview...</p>
</div>

<style>
  .loading-redirect {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    color: #94a3b8;
  }
</style>