<script lang="ts" context="module">
    export type Width =
        | "fit"
        | {
              fr: number;
          }
        | {
              ch: number;
          }
        | {
              px: number;
          }
        | {
              percent: number;
          };

    export type Content =
        | "index"
        | "icon"
        | "name"
        | "path"
        | "size"
        | "date"
        | "mimeType";

    export type Column = {
        width: Width;
        content: Content;
    };
</script>

<script lang="ts">
    import type { File } from "$lib/file/types";
    import { displayDateRange } from "$lib/file/date";
    import { formatBytes } from "$lib/file/size";
    import { getIcon } from "$lib/file/filetypes";
    import { Button } from "$lib/components/ui/button";
    import { encodePath } from "$lib/utils";

    let {
        data,
        index,
        columns,
    }: {
        data: File;
        index: number;
        columns: Column[];
    } = $props();

    let browsePath = $derived(
        encodePath(`/browse/${data.path}`) // TODO: This broken
    );

    function widthStyle(width: Width): string {
        if (width === "fit") return "width: fit-content;";
        if ("fr" in width) return `flex: ${width.fr};`;
        if ("px" in width) return `width: ${width.px}px;`;
        if ("percent" in width) return `width: ${width.percent}%;`;
        if ("ch" in width) return `width: ${width.ch}ch;`;
    }
</script>

<Button
    class="flex w-full {index % 2 === 0
        ? ''
        : 'bg-secondary/50 text-secondary-foreground'}"
    href={browsePath}
    variant="link"
>
    {#each columns as { width, content }}
        <div style={widthStyle(width)} class="text-ellipsis overflow-hidden">
            {#if content === "index"}
                <div class="opacity-25 text-right pr-4">
                    {index}
                </div>
            {:else if content === "icon"}
                <svelte:component
                    this={getIcon(data.filetype)}
                    class="h-8 w-8"
                />
            {:else if content === "name"}
                <div
                    class="font-medium flex-1 p-2 overflow-hidden whitespace-nowrap text-ellipsis"
                >
                    {data.name}
                </div>
            {:else if content === "path"}
                {data.path}
            {:else if content === "size"}
                {data.source === "db" ? formatBytes(data.size) : "-"}
            {:else if content === "date"}
                {data.source === "db" ? displayDateRange(data.date) : "-"}
            {:else if content === "mimeType"}
                {data.filetype.mimeType}
            {/if}
        </div>
    {/each}
</Button>
