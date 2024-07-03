<script lang="ts">
    import Directory from "./Directory.svelte";
    import File from "./File.svelte";

    let { data } = $props();
</script>

{#if data.entry.type === "directory"}
    <Directory data={data.entry} />
{:else}
    <File data={data.entry} />
{/if}
