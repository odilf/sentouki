<script lang="ts">
  import { bundledLanguages, codeToHtml } from "shiki";

  let { extension, raw }: { extension: string | undefined; raw: string } =
    $props();

  let text = $derived((await fetch(raw)).text());

  const html = $derived(
    codeToHtml(await text, {
      lang: Object.keys(bundledLanguages).includes(extension ?? "")
        ? (extension ?? "")
        : "text",
      theme: "rose-pine",
    })
  );
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html html}

<style lang="postcss">
  @reference "$lib/../app.css";
  :global(.shiki) {
    @apply p-2;
  }
</style>
