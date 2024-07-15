<script lang="ts">
    import * as Table from "$lib/components/ui/table";

    import Child from "./Child.svelte";
    import type { DbFile, File, FsFile } from "$lib/file/types";

    let {
        file,
        children,
    }: {
        file: File;
        children: {
            db: DbFile[];
            fs: Promise<FsFile>[];
        };
    } = $props();
</script>

<Table.Root>
    <Table.Header class="sticky top-0">
        <Table.Row class="sticky top-0">
            <Table.Head class="w-[20px]"><!-- Index --></Table.Head>
            <Table.Head class="w-[100px]"><!-- Type --></Table.Head>
            <Table.Head>Name</Table.Head>
            <Table.Head>Size</Table.Head>
            <Table.Head>Date</Table.Head>
            <Table.Head>Mime type</Table.Head>
        </Table.Row>
    </Table.Header>

    <Table.Body>
        {#each children.db as child, i}
            <Child data={{ ...child, source: "db" }} index={i} />
        {/each}

        {#each children.fs as child, i}
            {#await child then child}
                <Child data={{ ...child, source: "filesystem" }} index={i} />
            {/await}
        {/each}
    </Table.Body>
</Table.Root>
