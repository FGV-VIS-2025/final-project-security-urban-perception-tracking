<script>
  export let size = 24;
  export let color = "white";
  export let strokeWidth = 1.5;
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
    d="M18.952 8.60639L21.4621 8.45358C19.6628 3.70459 14.497 0.999731 9.46037 2.34456C4.09595 3.77692 0.909592 9.26089 2.34343 14.5933C3.77728 19.9258 9.28835 23.0874 14.6528 21.6551C18.6358 20.5916 21.418 17.2945 22 13.4842"
    stroke={color}
    stroke-width={strokeWidth}
    stroke-linecap="round"
    stroke-linejoin="round"
  />
  <path
    opacity="0.4"
    d="M12 7.99982V11.9998L14 13.9998"
    stroke={color}
    stroke-width={strokeWidth}
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>