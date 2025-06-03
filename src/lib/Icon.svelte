<script>
  import OverviewIcon from "./Icons/OverviewIcon.svelte";
  import MapIcon from "./Icons/MapIcon.svelte";
  import DevelopIcon from "./Icons/DevelopIcon.svelte";
  import EyeIcon from "./Icons/EyeIcon.svelte";

  export let name;
  export let size = 24;
  export let color = "currentColor";
  export let strokeWidth = 1.5;

  const icons = {
    home: OverviewIcon,
    eye: EyeIcon,
    map: MapIcon,
    develop: DevelopIcon
  };

  $: IconComponent = icons[name];
</script>

{#if IconComponent}
  <svelte:component
    this={IconComponent}
    {size}
    {color}
    {strokeWidth}
    {...$$restProps}
  />
{:else}
  <span>❓</span>
{/if}
