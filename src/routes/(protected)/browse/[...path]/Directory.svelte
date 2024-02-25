<script lang="ts">
    import * as Table from '$lib/components/ui/table'
    import { goto, preloadData } from '$app/navigation'
    import type { Entry } from '$lib/fs/directory'

    export let entries: Entry[]
</script>

<Table.Root>
    <Table.Header>
        <Table.Row>
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
                <Table.Cell>{entry.type}</Table.Cell>
                <Table.Cell class="font-medium">{entry.name}</Table.Cell>
                <Table.Cell>{entry.size ?? 'N/A'}</Table.Cell>
            </Table.Row>
        {/each}
    </Table.Body>
</Table.Root>
