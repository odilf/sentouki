<script lang="ts">
    import "../app.pcss";
    import "@fontsource/atkinson-hyperlegible";

    import { ModeWatcher } from "mode-watcher";
    import { SearchDialog } from "$lib/components/ui/search";
    import { page } from "$app/stores";
    import Nav from "./Nav.svelte";

    let { children } = $props();
</script>

<ModeWatcher />

<div class="min-h-screen grid grid-rows-[auto,1fr]">
    <Nav user={$page.data.user ?? null} file={$page.data.file ?? null} />

    <main>
        {@render children()}
    </main>
</div>

<SearchDialog />
