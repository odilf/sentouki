<script lang="ts">
    import { goto, preloadData } from "$app/navigation";
    import * as Table from "$lib/components/ui/table";
    import type { File } from "$lib/file/types";
    import { displayDateRange } from "$lib/file/date";
    import { formatBytes } from "$lib/file/size";
    import { getIcon } from "$lib/file/filetypes";

    let {
        data,
        index,
    }: {
        data: File;
        index: number;
    } = $props();

    let browsePath = $derived(
        `/browse/${data.path}`.split("/").map(encodeURIComponent).join("/") // TODO: This broken
    );
</script>

<Table.Row
    class="h-fit cursor-pointer"
    on:click={() => goto(browsePath)}
    on:mouseover={() => preloadData(browsePath)}
>
    <Table.Cell class="opacity-25 p-2">
        {index}
    </Table.Cell>
    <Table.Cell class="p-2">
        <svelte:component this={getIcon(data.filetype)} class="h-8 w-8" />
    </Table.Cell>
    <Table.Cell class="font-medium p-2 overflow-hidden whitespace-nowrap text-ellipsis">
        {data.name}
    </Table.Cell>
    <Table.Cell class="p-2">
        {data.source === "db" ? formatBytes(data.size) : "-"}
    </Table.Cell>
    <Table.Cell class="p-2">
        {data.source === "db" ? displayDateRange(data.date) : "-"}
    </Table.Cell>
    <Table.Cell class="p-2">
        {data.filetype.mimeType}
    </Table.Cell>
</Table.Row>
