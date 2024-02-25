<script lang="ts">
    import { enhance } from '$app/forms'
    import { Button } from '$lib/components/ui/button'
    import { FormButton } from '$lib/components/ui/form'
    export let data
</script>

<main class="mx-auto flex max-w-lg flex-col px-4 py-8">
    <h1 class="text-4xl font-bold">{data.user.username}</h1>

    <span class="mb-8 opacity-40"> {data.user.id} </span>

    <form method="post" use:enhance action="/login?/logout">
        <FormButton>Log out</FormButton>
    </form>
</main>
