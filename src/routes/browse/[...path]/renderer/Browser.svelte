<script lang="ts">
  let {
    name,
    mimeType,
    raw,
  }: { name: string; mimeType: string | undefined; raw: string } = $props();
</script>

<object title={name} data={raw} type={mimeType} class="h-full w-full">
  <p class="grid h-full w-full content-center text-center opacity-50">
    It seems browser can't render this file of type `{mimeType ?? "unknown"}`...

    <br />

    Maybe try a different renderer?
  </p>
</object>
