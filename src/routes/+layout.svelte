<script lang="ts">
    import '../app.pcss'
    import '@fontsource/atkinson-hyperlegible'

    import { ModeWatcher } from 'mode-watcher'
</script>

<ModeWatcher />

<slot />

<style>
    :global(body) {
        font-family: 'Atkinson Hyperlegible', sans-serif;
    }
</style>
