<script>
  export let size = 20;
  export let color = "white";
  export let strokeWidth = 2;
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
    d="M11 5L18 5"
    stroke={color}
    stroke-width={strokeWidth}
    stroke-linecap="round"
    stroke-linejoin="round"
  />
  <path
    d="M10 10L14.5 14.5"
    stroke={color}
    stroke-width={strokeWidth}
    stroke-linecap="round"
    stroke-linejoin="round"
  />
  <path
    d="M5 11L5 18"
    stroke={color}
    stroke-width={strokeWidth}
    stroke-linecap="round"
    stroke-linejoin="round"
  />
  <circle
    cx="6.44444"
    cy="6.44444"
    r="4.44444"
    stroke={color}
    stroke-width="1.5"
  />
  <circle cx="5" cy="20" r="2" stroke={color} stroke-width="1.5" />
  <circle cx="16" cy="16" r="2" stroke={color} stroke-width="1.5" />
  <circle cx="20" cy="5" r="2" stroke={color} stroke-width="1.5" />
</svg>
