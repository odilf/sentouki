<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { Button, buttonVariants } from "$lib/components/ui/button";
    import * as Menubar from "$lib/components/ui/menubar";
    import * as Select from "$lib/components/ui/select";
    import { Separator } from "$lib/components/ui/separator";
    import { displayDateRange } from "$lib/file/date";
    import { renderers } from "$lib/file/renderer";
    import { formatBytes } from "$lib/file/size";
    import type { File } from "$lib/file/types";
    import type { User } from "lucia";
    import { UserIcon } from "lucide-svelte";

    let {
        user,
        file,
    }: {
        user: User | null;
        file: File | null;
    } = $props();

    async function updateRenderer(renderer: string | null | undefined) {
        // TODO: Maybe clear `search` param if `query` is empty
        const url = $page.url;
        if (renderer == null) {
            url.searchParams.delete("renderer");
        } else {
            url.searchParams.set("renderer", renderer);
        }

        await goto(url, {
            keepFocus: true,
            invalidateAll: true, // TODO: We shouldn't need to invalidate, but `$page` for some reason isn't being reactive
        });
    }

    const initialRenderer = renderers.find(
        ({ data: { name } }) => name === $page.url.searchParams.get("renderer")
    );
</script>

<Menubar.Root
    class="sticky top-0 z-30 bg-secondary/80 text-secondary-foreground backdrop-blur p-0"
>
    <Menubar.Menu>
        <div
            class="flex-1 pr-2 flex px-2 gap-4 whitespace-nowrap overflow-hidden"
        >
            {#if file}
                <div class="text-ellipsis overflow-hidden whitespace-nowrap">
                    {file.name}
                </div>

                {#if file.source === "db"}
                    <div class="opacity-50">
                        {displayDateRange(file.date)}
                    </div>

                    <div class="opacity-50">
                        {formatBytes(file.size)}
                    </div>
                {/if}

                <div class="opacity-20">
                    {file.source}
                </div>
            {/if}
        </div>
        <a class="opacity-50 font-bold text-center" href="/">sentouki</a>
        <div class="flex-1 overflow-hidden flex justify-end">
            {#if file && file.filetype.mimeType !== "inode/directory"}
                <Select.Root
                    selected={{
                        value: initialRenderer?.data.name ?? null,
                        label: initialRenderer?.data.displayName ?? "Auto",
                    }}
                    onSelectedChange={(selected) =>
                        updateRenderer(selected?.value)}
                >
                    <Select.Trigger class="w-[150px] m-0 bg-opacity-20">
                        <Select.Value
                            placeholder="Renderer"
                            class="text-secondary-foreground"
                        />
                    </Select.Trigger>
                    <Select.Content>
                        <Select.Item value={null}>Auto</Select.Item>

                        <Separator class="my-2" />

                        {#each renderers as renderer}
                            <Select.Item
                                value={renderer.data.name}
                                label={renderer.data.displayName}
                            >
                                {renderer.data.displayName}
                            </Select.Item>
                        {/each}
                    </Select.Content>
                </Select.Root>
            {/if}

            <Button href="/settings" variant="ghost" class="mx-0">
                <span>
                    {#if user}
                        {user.username}
                    {:else}
                        Sign in
                    {/if}
                </span>
                <UserIcon class="mr-2" />
            </Button>
        </div>
    </Menubar.Menu>
</Menubar.Root>
