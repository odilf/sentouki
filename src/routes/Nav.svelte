<script lang="ts">
import { Button } from "$lib/components/ui/button";
import * as Menubar from "$lib/components/ui/menubar";
import { displayDateRange } from "$lib/file/date";
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
        <div class="opacity-50 font-bold text-center">sentouki</div>
        <div class="flex-1 text-right overflow-hidden">
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
