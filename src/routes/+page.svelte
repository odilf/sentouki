<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { Folder } from "lucide-svelte";

    let { data } = $props();
</script>

<main class="mx-auto grid h-full content-center gap-8">
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
            <Button class="py-6 text-xl" variant="default" size="lg">
                <a href="/browse" data-sveltekit-preload-data="eager">
                    Browse
                </a>
            </Button>

            <Button class="py-6 text-xl" variant="secondary" size="lg">
                <a href="/search"> Search </a>
            </Button>
        {:else}
            <Button class="py-6 text-xl" variant="default" size="lg">
                <a href="/login"> Log in </a>
            </Button>
        {/if}
    </div>
</main>
