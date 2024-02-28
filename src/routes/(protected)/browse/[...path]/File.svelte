<script lang="ts">
    import { ArrowBigLeft } from 'lucide-svelte'
    import { ft } from '$lib/fs'

    export let paramsPath: string
    export let filename: string
    export let mimeType: string
    export let extension: string

    $: serverPath = `/raw/${paramsPath}`
    $: renderer = ft.getComponent({ mimeType, extension })
</script>

<main class="mx-auto min-h-[100dvh] max-w-6xl px-4 py-8">
    <h1 class="relative mb-8 flex items-center text-4xl font-bold">
        <a href="./">
            <ArrowBigLeft class="left-0 mr-2 h-9 w-9" />
        </a>
        {filename}
    </h1>

    <svelte:component this={renderer} {serverPath} />
</main>
