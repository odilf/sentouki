<script lang="ts">
    import Directory from "./Directory.svelte";
    import File from "./File.svelte";

    let { data } = $props();
</script>

<!-- {JSON.stringify(data)} -->

{#if data.file.filetype.mimeType === "inode/directory"}
    <Directory file={data.file} children={data.children} />
{:else}
    <File file={data.file} />
{/if}
