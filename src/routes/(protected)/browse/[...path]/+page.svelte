<script lang="ts">
    import Directory from "./Directory.svelte";
    import File from "./File.svelte";
    import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";

    let { data } = $props();
    let scrollingContainer: HTMLDivElement | undefined = $state(undefined);

    $effect(() => {
        if (data.file.path) {
            scrollingContainer?.scrollTo({
                left: scrollingContainer.scrollWidth,
            });
        }
    });
</script>

<Breadcrumb.Root
    class="py-1 px-2 w-screen h-8 max-w-screen overflow-scroll relative"
    bind:el={scrollingContainer}
>
    <Breadcrumb.List class="px-2 flex-nowrap sticky right-0 ">
        <Breadcrumb.Item>
            <Breadcrumb.Link href="/browse/">root</Breadcrumb.Link>
        </Breadcrumb.Item>

        {#each data.file.path.split("/") as component, i}
            <Breadcrumb.Separator />

            <Breadcrumb.Item>
                <Breadcrumb.Link
                    class="whitespace-nowrap"
                    href="/browse/{data.file.path
                        .split('/')
                        .slice(0, i + 1)
                        .join('/')}">{component}</Breadcrumb.Link
                >
            </Breadcrumb.Item>
        {/each}
    </Breadcrumb.List>
</Breadcrumb.Root>

{#if data.file.filetype.mimeType === "inode/directory"}
    <Directory file={data.file} children={data.children} />
{:else}
    <File file={data.file} />
{/if}
