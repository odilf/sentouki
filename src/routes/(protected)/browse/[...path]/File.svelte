<script lang="ts">
    import { ArrowBigLeft } from "lucide-svelte";
    import * as ft from "$lib/fs/filetypes.svelte";
    import type { FileData } from "$lib/fs/file";
    import * as path from "$lib/fs/path";

    let { data }: { data: FileData } = $props();

    let serverPath = $derived(path.getServerRaw(data.path));
    let renderer = $derived(ft.getComponent(data));
</script>

<main class="mx-auto min-h-[100dvh] max-w-6xl px-4 py-8">
    <h1 class="relative mb-8 flex items-center text-4xl font-bold">
        <a href="./">
            <ArrowBigLeft class="left-0 mr-2 h-9 w-9" />
        </a>
        {data.name}
    </h1>

    <svelte:component this={renderer} {serverPath} />
</main>
