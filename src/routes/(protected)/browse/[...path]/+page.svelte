<script lang="ts">
    import Directory from './Directory.svelte'
    import File from './File.svelte'

    export let data
</script>

{#if data.type === 'dir'}
    <Directory entries={data.entries} />
{:else}
    <File />
{/if}
