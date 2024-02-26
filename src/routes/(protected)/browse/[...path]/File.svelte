<script lang="ts">
    import { getFiletypeData } from './supportedFiletypes'

    export let paramsPath: string
    export let filename: string
    export let filetype: string

    $: serverPath = `/raw/${paramsPath}`
    $: filetypeData = getFiletypeData(filetype)
</script>

<main class="mx-auto min-h-[100dvh] max-w-4xl py-8">
    <h1 class="mb-8 text-4xl font-bold">{filename}</h1>

    {#if filetypeData === null}
        Filetype .{filetype} is not supported
    {:else}
        <object
            data={serverPath}
            title={filename}
            class="{filetypeData.height === 'maximize'
                ? 'h-screen'
                : ''} w-full"
        >
            Server path: {serverPath}
        </object>
    {/if}
</main>
