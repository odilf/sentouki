<script lang="ts">
    import { ArrowBigLeft } from "lucide-svelte";
    // import * as ft from "$lib/file/filetypes.svelte";
    // import type { FileData } from "$lib/fs/file";
    // import * as path from "$lib/fs/path";
    // import type { fileTable } from "$lib/server/db/schema";

    import type { File } from "$lib/file/types";
    import { getRenderer } from "$lib/file/renderer";

    let {
        file,
    }: {
        file: File;
    } = $props();

    let serverPath = $derived(
        `/raw/${file.path}`.split("/").map(encodeURIComponent).join("/")
    );
</script>

<main class="mx-auto min-h-[100dvh] max-w-6xl px-4 py-8">
    <h1 class="relative mb-8 flex items-center text-4xl font-bold">
        <a href="./">
            <ArrowBigLeft class="left-0 mr-2 h-9 w-9" />
        </a>
        {file.name}
    </h1>

    <svelte:component this={getRenderer(file.filetype)} {serverPath} />
</main>
