<script>
  export let size = 30;
  export let color = "white";
  export let strokeWidth = 0.5;
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
  {...$$restProps}
>
  <path
    d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
    stroke={color}
    stroke-width={strokeWidth}
    stroke-linecap="square"
  />
  <path
    d="M12 15V8M15.5 12.5002L12 16.0002L8.5 12.5002"
    stroke={color}
    stroke-width={strokeWidth}
    stroke-linecap="square"
  />
</svg>
