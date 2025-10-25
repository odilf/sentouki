<script lang="ts">
    import "../app.css";
    import favicon from "$lib/assets/favicon.svg";
    import "@fontsource-variable/atkinson-hyperlegible-next";

    let { children } = $props();
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}
