<script lang="ts">
  import { codeToHtml } from "shiki";

  let { extension, raw }: { extension: string | undefined; raw: string } =
    $props();

  let text = $derived((await fetch(raw)).text());

  const html = $derived(
    codeToHtml(await text, {
      lang: extension ?? "",
      theme: "rose-pine",
    })
  );
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html html}
