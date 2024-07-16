<script lang="ts">
    import type { File } from "$lib/file/types";
    import { getRenderer } from "$lib/file/renderer";
    import { encodePath } from "$lib/utils";

    let {
        file,
    }: {
        file: File;
    } = $props();

    let serverPath = $derived(encodePath(`/raw/${file.path}`));
</script>

<main class="mx-auto min-h-[100dvh] max-w-6xl px-4 py-8">
    <svelte:component this={getRenderer(file.filetype)} {serverPath} />
</main>
