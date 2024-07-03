<script lang="ts">
    import { enhance } from "$app/forms";
    import { FormButton } from "$lib/components/ui/form";
    import { Badge } from "$lib/components/ui/badge";
    import type { User } from "$lib/server/auth";

    let {
        user,
        cacheSize,
    }: {
        user: User;
        cacheSize: number;
    } = $props();
</script>

<section class="mb-8">
    <h1 class="text-4xl font-bold">
        {user.username}
    </h1>

    {#if user.isAdmin}
        <Badge variant="secondary">Admin</Badge>
    {:else}
        <div class="opacity-40">{user.id}</div>
    {/if}
</section>

<form method="post" use:enhance action="/login?/logout" class="mb-12">
    <FormButton>Log out</FormButton>
</form>

{#if user.isAdmin}
    <h2 class="text-3xl mb-2 font-semibold">Admin section</h2>
    <form method="post" use:enhance action="?/populateCache" class="mb-2">
        <FormButton variant="destructive">Populate cache</FormButton>
    </form>

    <form method="post" use:enhance action="?/deleteCache" class="mb-2">
        <FormButton variant="destructive">Delete cache</FormButton>
    </form>

    <h3 class="text-2xl">Cache size</h3>
    <p class="mb-2">Cache has {cacheSize} rows.</p>
{/if}
