<script lang="ts">
    import { ArrowBigLeft } from 'lucide-svelte'
    import { ft } from '$lib/fs'
    import type { FileData } from '$lib/fs/file'
    import * as path from '$lib/fs/path'

    export let data: FileData

    $: serverPath = path.getServerRaw(data.path)
    $: renderer = ft.getComponent(data)
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
