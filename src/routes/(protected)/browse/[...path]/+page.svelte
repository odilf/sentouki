<script lang="ts">
    import Directory from './Directory.svelte'
    import File from './file/File.svelte'

    export let data
</script>

{#if data.type === 'dir'}
    <Directory entries={data.entries} />
{:else}
    <File
        paramsPath={data.paramsPath}
        filename={data.filename}
        filetype={data.filetype}
    />
{/if}
