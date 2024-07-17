<script lang="ts">
    import Child, { type Column } from "./Child.svelte";
    import type { DbFile, File, FsFile } from "$lib/file/types";

    let {
        file,
        children,
    }: {
        file: File;
        children: {
            db: DbFile[];
            fs: Promise<Promise<FsFile>[]>;
        };
    } = $props();

    const columns: Column[] = [
        { width: { ch: 5 }, content: "index" },
        { width: "fit", content: "icon" },
        { width: { fr: 1 }, content: "name" },
        { width: { fr: 0.2 }, content: "path" },
        { width: { px: 100 }, content: "size" },
        { width: { px: 100 }, content: "date" },
        { width: { px: 100 }, content: "mimeType" },
    ];
</script>

{#key file.path}
    <div class="max-w-full w-full mx-auto">
        {#each children.db as child, i (child.path)}
            <Child data={{ ...child, source: "db" }} index={i} {columns} />
        {/each}

        {#await children.fs then fsChildren}
            {#each fsChildren as child, i}
                {#await child then child}
                    {#if children.db.every((dbChild) => dbChild.path !== child.path)}
                        <Child
                            data={{ ...child, source: "filesystem" }}
                            index={i + children.db.length}
                            {columns}
                        />
                    {/if}
                {/await}
            {/each}
        {/await}
    </div>
{/key}
