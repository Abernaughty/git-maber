<script>
  export let text = "Button";
  export let type = "primary"; // primary, secondary, outline
  export let onClick = () => {};
</script>

<button
  on:click={onClick}
  class={`
    px-4 py-2 rounded-md font-medium transition-colors duration-300
    ${type === 'primary' ? 'bg-primary text-background hover:bg-opacity-90' : ''}
    ${type === 'secondary' ? 'bg-secondary text-background hover:bg-opacity-90' : ''}
    ${type === 'outline' ? 'bg-transparent border border-primary text-primary hover:bg-primary hover:text-background' : ''}
  `}
>
  {text}
</button>
