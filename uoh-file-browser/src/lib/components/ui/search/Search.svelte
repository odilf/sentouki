<script lang="ts">
    import * as Command from '$lib/components/ui/command'
    import { goto } from '$app/navigation'
    import { page } from '$app/stores'
    import type { files } from '$lib/server/db/schema'
    import { flip } from 'svelte/animate'
    import * as ft from '$lib/fs/filetypes'

    export let query: string = ''
    export let open: boolean = false

    $: results = $page.data?.stream?.searchResult as Promise<
        (typeof files.$inferSelect)[]
    >

    async function updateSearch(query: string) {
        // TODO: Maybe clear `search` param if `query` is empty
        const url = new URL($page.url)
        url.searchParams.set('search', query)
        await goto(url, {
            keepFocus: true,
            invalidateAll: true,
        })
    }

    $: updateSearch(query)
</script>

<Command.Root>
    <Command.Input
        placeholder="Write file to search for..."
        bind:value={query}
    />
    <Command.List class="h-[80vh]">
        <Command.Empty>No results found.</Command.Empty>

        {#await results}
            Loading
        {:then results}
            {#each results ?? [] as result (result.path)}
                <div animate:flip={{ duration: 300 }}>
                    <Command.Item
                        onSelect={async () => {
                            console.log(result)
                            open = false
                            await goto(`/browse/${result.path}`)
                        }}
                        class="flex max-w-[calc(32rem-theme(space.12))] gap-2 overflow-x-hidden"
                    >
                        <svelte:component
                            this={ft.getIcon({
                                mimeType: result.mimeType,
                                extension: result.name.split('.').at(-1) ?? '',
                            })}
                            class="h-4 w-4 min-w-4"
                        />
                        <div class="overflow-ellipsis whitespace-nowrap">
                            {result.name}
                        </div>
                        <div
                            class="overflow-hidden overflow-ellipsis whitespace-nowrap text-sm opacity-50"
                        >
                            {result.path}
                        </div>
                    </Command.Item>
                </div>
            {/each}
        {/await}
    </Command.List>
</Command.Root>
