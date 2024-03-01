<script lang="ts">
    import { Search } from '$lib/components/ui/search'
    import '../app.pcss'
    import '@fontsource/atkinson-hyperlegible'

    import { ModeWatcher } from 'mode-watcher'

    import * as Dialog from '$lib/components/ui/dialog'

    let open: boolean
</script>

<ModeWatcher />

<slot />

<Dialog.Root bind:open>
    <Dialog.Content>
        <Dialog.Header>
            <Dialog.Title>Search</Dialog.Title>
            <Dialog.Description>
                <Search query={'peepee (TODO)'} />
            </Dialog.Description>
        </Dialog.Header>
    </Dialog.Content>
</Dialog.Root>

<svelte:window
    on:keydown={(e) => {
        if (e.code === 'KeyK' && (e.metaKey || e.ctrlKey)) {
            open = !open
        }
    }}
/>

<style>
    :global(body) {
        font-family: 'Atkinson Hyperlegible', sans-serif;
    }
</style>
