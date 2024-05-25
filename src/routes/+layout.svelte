<script lang="ts">
    import "../app.pcss";
    import "@fontsource/atkinson-hyperlegible";

    import { ModeWatcher } from "mode-watcher";

    import { SearchDialog } from "$lib/components/ui/search";
</script>

<ModeWatcher />

<slot />

<SearchDialog />

<style>
    :global(body) {
        font-family: "Atkinson Hyperlegible", sans-serif;
    }
</style>
