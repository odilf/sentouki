<script lang="ts">
    import * as Table from '$lib/components/ui/table'
    import * as ft from './file/filetypes'
    import { goto, preloadData } from '$app/navigation'
    import type { Entry } from '$lib/fs/directory'
    import { Folder } from 'lucide-svelte'

    export let entries: Entry[]
</script>

<Table.Root>
    <Table.Header class="sticky top-0">
        <Table.Row class="sticky top-0">
            <Table.Head class="w-[20px]"></Table.Head>
            <Table.Head class="w-[100px]">Type</Table.Head>
            <Table.Head>Name</Table.Head>
            <Table.Head>Size</Table.Head>
        </Table.Row>
    </Table.Header>

    <Table.Body>
        {#each entries as entry, i (entry.appPath)}
            <Table.Row
                class="cursor-pointer"
                on:click={() => goto(entry.appPath)}
                on:mouseover={() => preloadData(entry.appPath)}
            >
                <Table.Cell class="opacity-25">{i}</Table.Cell>
                <Table.Cell>
                    {#if entry.type === 'dir'}
                        <Folder />
                    {:else}
                        {@const icon = ft.getIcon(entry.type)}
                        {#if icon}
                            <svelte:component this={icon} />
                        {:else}
                            {entry.type}
                        {/if}
                    {/if}
                </Table.Cell>
                <Table.Cell class="font-medium">{entry.name}</Table.Cell>
                <Table.Cell>{entry.size ?? 'N/A'}</Table.Cell>
            </Table.Row>
        {/each}
    </Table.Body>
</Table.Root>
