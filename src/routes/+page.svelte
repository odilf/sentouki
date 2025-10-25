<script lang="ts">
    import { resolve } from "$app/paths";

    let { data } = $props();
</script>

<main class="mx-auto grid h-screen max-w-xl content-center px-4 py-10">
    <h1 class="text-8xl">sentouki</h1>
    <p>File browser for UOH</p>

    {#if !data.user}
        <a href={resolve(`/profile/login`)}> Log in </a>
    {:else}
        <a href={resolve("/browse")}> browse </a>
    {/if}
</main>
