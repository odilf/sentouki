<script lang="ts" context="module">
    import Image from './Image.svelte'
    import Video from './Video.svelte'
    import ObjectFullScreen from './ObjectFullScreen.svelte'
    import Unknown from './Unknown.svelte'

    /**
     * List of renderers that get mapped to their respective svelte components.
     *
     * Important: Each renderer component must have a single property that is `serverPath: string`.
     */
    export let renderers = {
        image: Image,
        video: Video,
        objectFullScreen: ObjectFullScreen,
        unknown: Unknown,
    } as const

    export type Renderer = keyof typeof renderers

    // Technically a map from renderer to filetype would be more efficient and less repetitive,
    // but I believe this is more straightforward
    export let filetypeRenderers: Record<string, Renderer> = {
        png: 'image',
        jpg: 'image',
        pdf: 'objectFullScreen',
        mp4: 'video',
        mov: 'video',
        mkv: 'video',
    } as const
</script>

<script lang="ts">
    export let paramsPath: string
    export let filename: string
    export let filetype: string

    $: serverPath = `/raw/${paramsPath}`
    $: renderer = filetypeRenderers[filetype.toLowerCase()]
</script>

<main class="mx-auto min-h-[100dvh] max-w-4xl py-8">
    <h1 class="mb-8 text-4xl font-bold">{filename}</h1>

    <svelte:component this={renderers[renderer] ?? Unknown} {serverPath} />
</main>
