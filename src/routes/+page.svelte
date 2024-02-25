<script lang="ts">
    import { Button } from '$lib/components/ui/button'
    import { Folder } from 'lucide-svelte'

    export let data
</script>

<main class="mx-auto grid h-screen content-center gap-8">
    <div class="mx-auto flex w-fit items-center gap-[1vw]">
        <Folder
            class="aspect-square h-20 w-20 lg:h-52 lg:w-52"
            strokeWidth={1.5}
        />
        <h1 class="mx-auto text-4xl font-bold lg:text-8xl">
            The UOH <br /> File Browser
        </h1>
    </div>

    <div class="mx-auto flex gap-4">
        {#if data.user}
            <Button class="mx-auto w-fit p-6 text-lg">
                <a href="/browse"> Browse </a>
            </Button>

            <Button class="mx-auto w-fit p-6 text-lg">
                <a href="/profile"> Profile </a>
            </Button>
        {:else}
            <Button class="mx-auto w-fit p-6 text-lg">
                <a href="/login"> Log in </a>
            </Button>
        {/if}
    </div>
</main>
