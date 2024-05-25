<script lang="ts">
    import { enhance } from "$app/forms";
    import { FormButton } from "$lib/components/ui/form";
    import type { User } from "lucia";
    import { Badge } from "$lib/components/ui/badge";

    export let user: User;
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

<form method="post" use:enhance action="/login?/logout" class="mb-8">
    <FormButton>Log out</FormButton>
</form>

{#if user.isAdmin}
    <form
        method="post"
        use:enhance
        action="?/populateCache"
        class="rounded bg-zinc-900 p-4"
    >
        <h2 class="text-xl">Admin actions</h2>
        <FormButton variant="destructive">Populate cache</FormButton>
    </form>
{/if}
