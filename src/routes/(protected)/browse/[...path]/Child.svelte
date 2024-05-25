<script lang="ts">
    import { goto, preloadData } from "$app/navigation";
    import * as Table from "$lib/components/ui/table";
    import * as ft from "$lib/fs/filetypes";
    import * as path from "$lib/fs/path";
    import { type FileData } from "$lib/fs/file";
    import { displayDateRange } from "$lib/fs/date";
    import { formatBytes } from "$lib/fs/size";

    export let data: FileData;
    export let index: number;
</script>

<Table.Row
    class="h-16 cursor-pointer"
    on:click={() => goto(path.getServerBrowse(data.path))}
    on:mouseover={() => preloadData(["browse", ...data.path].join("/"))}
>
    <Table.Cell class="opacity-25">
        {index}
    </Table.Cell>
    <Table.Cell>
        <svelte:component this={ft.getIcon(data)} class="h-10 w-10" />
    </Table.Cell>
    <Table.Cell class="font-medium">
        {data.name}
    </Table.Cell>
    <Table.Cell>
        {formatBytes(data.size)}
    </Table.Cell>
    <Table.Cell>
        {displayDateRange(data.date)}
    </Table.Cell>
    <Table.Cell>
        {data.mimeType}
    </Table.Cell>
</Table.Row>
