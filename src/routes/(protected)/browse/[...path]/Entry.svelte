<script lang="ts">
    import { goto, preloadData } from '$app/navigation'
    import * as Table from '$lib/components/ui/table'
    import { ft } from '$lib/fs'
    import type { Entry } from '$lib/fs/directory'
    import { formatBytes } from '$lib/fs/size'
    import { MoreHorizontalIcon } from 'lucide-svelte'
    import { fade } from 'svelte/transition'

    export let entry: Entry
    export let index: number

    let metadata: Awaited<Entry['metadata']> | null = null
    $: entry.metadata.then((m) => (metadata = m))

    $: icon = metadata
        ? ft.getIcon({
              extension: entry.extension,
              mimeType: metadata.mimeType,
          })
        : MoreHorizontalIcon

    $: date =
        metadata?.date.toLocaleString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
        }) ?? ''
</script>

<Table.Row
    class="h-16 cursor-pointer"
    on:click={() => goto(entry.appPath)}
    on:mouseover={() => preloadData(entry.appPath)}
>
    <Table.Cell class="opacity-25">{index}</Table.Cell>
    <Table.Cell>
        <div in:fade>
            <svelte:component this={icon} class="h-10 w-10" />
        </div>
    </Table.Cell>
    <Table.Cell class="font-medium">{entry.name}</Table.Cell>
    <Table.Cell>
        <div in:fade>
            {metadata ? formatBytes(metadata.size) : ''}
        </div>
    </Table.Cell>
    <Table.Cell>
        <div in:fade>
            {date}
        </div>
    </Table.Cell>
    <Table.Cell>
        <div in:fade>
            {metadata?.mimeType ?? ''}
        </div>
    </Table.Cell>
</Table.Row>
