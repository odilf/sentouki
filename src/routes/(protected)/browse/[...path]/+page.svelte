<script lang="ts">
    import Directory from "./Directory.svelte";
    import File from "./File.svelte";

    let { data } = $props();
</script>

{#if "children" in data.file}
    <Directory children={data.file.children} />
{:else}
    <File data={data.file} />
{/if}
