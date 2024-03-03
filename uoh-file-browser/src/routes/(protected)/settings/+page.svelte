<script lang="ts">
    import Settings from './Settings.svelte'
    export let data
</script>

<main class="mx-auto flex max-w-lg flex-col px-4 py-8">
    <Settings user={data.user} />
</main>
