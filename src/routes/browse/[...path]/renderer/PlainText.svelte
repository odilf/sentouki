<script lang="ts">
  let { raw }: { raw: string } = $props();

  let text = $derived((await fetch(raw)).text());
</script>

<pre>{await text}</pre>
