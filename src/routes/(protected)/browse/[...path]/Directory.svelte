<script lang="ts">
    import * as Table from '$lib/components/ui/table'
    import { ft } from '$lib/fs'
    import { goto, preloadData } from '$app/navigation'
    import type { Entry as EntryType } from '$lib/fs/directory'
    import Entry from "./Entry.svelte"
    import { formatBytes } from '$lib/fs/size'

    export let entries: EntryType[]
</script>

<Table.Root>
    <Table.Header class="sticky top-0">
        <Table.Row class="sticky top-0">
            <Table.Head class="w-[20px]"></Table.Head>
            <Table.Head class="w-[100px]">Type</Table.Head>
            <Table.Head>Name</Table.Head>
            <Table.Head>Size</Table.Head>
            <Table.Head>Date</Table.Head>
            <Table.Head>Mime type</Table.Head>
        </Table.Row>
    </Table.Header>

    <Table.Body>
        {#each entries as entry, i (entry.appPath)}
            <Entry {entry} index={i} />
        {/each}
    </Table.Body>
</Table.Root>
