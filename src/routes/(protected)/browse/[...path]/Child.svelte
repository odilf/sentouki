<script lang="ts">
    import { goto, preloadData } from "$app/navigation";
    import * as Table from "$lib/components/ui/table";
    import type { DbFile, File } from "$lib/file/types";
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
        `/browse/${data.path}`.split("/").map(encodeURIComponent).join("/")
    );
</script>

<Table.Row
    class="h-fit cursor-pointer"
    on:click={() => goto(browsePath)}
    on:mouseover={() => preloadData(browsePath)}
>
    <Table.Cell class="opacity-25">
        {index}
    </Table.Cell>
    <Table.Cell>
        <svelte:component this={getIcon(data.filetype)} class="h-10 w-10" />
    </Table.Cell>
    <Table.Cell class="font-medium">
        {data.name}
    </Table.Cell>
    <Table.Cell>
        {data.source === "db" ? formatBytes(data.size) : "-"}
    </Table.Cell>
    <Table.Cell>
        {data.source === "db" ? displayDateRange(data.date) : "-"}
    </Table.Cell>
    <Table.Cell>
        {data.filetype.mimeType}
    </Table.Cell>
</Table.Row>
