<script lang="ts">
    import * as Table from "$lib/components/ui/table";

    import Child from "./Child.svelte";
    import type { FileData } from "$lib/fs/file";

    let { children }: { children: FileData[] } = $props();
</script>

<Table.Root>
    <Table.Header class="sticky top-0">
        <Table.Row class="sticky top-0">
            <Table.Head class="w-[20px]"><!-- Index --></Table.Head>
            <Table.Head class="w-[100px]">Type</Table.Head>
            <Table.Head>Name</Table.Head>
            <Table.Head>Size</Table.Head>
            <Table.Head>Date</Table.Head>
            <Table.Head>Mime type</Table.Head>
        </Table.Row>
    </Table.Header>

    <Table.Body>
        {#each children as child, i}
            <Child data={child} index={i} />
        {/each}
    </Table.Body>
</Table.Root>
