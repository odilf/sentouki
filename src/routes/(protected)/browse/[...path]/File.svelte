<script lang="ts">
    import type { File } from "$lib/file/types";
    import { getRenderer, renderers } from "$lib/file/renderer";
    import { encodePath } from "$lib/utils";
    import { page } from "$app/stores";

    let {
        file,
    }: {
        file: File;
    } = $props();

    let serverPath = $derived(encodePath(`/raw/${file.path}`));

    // TODO: This is not reactive lol
    let urlRenderer = $derived(renderers.find(
        ({ data: { name } }) => name === $page.url.searchParams.get("renderer")
    ));
</script>

<main class="mx-auto min-h-[100dvh] max-w-6xl px-4 py-8">
    <svelte:component this={urlRenderer?.default ?? getRenderer(file.filetype)} {serverPath} />
</main>
