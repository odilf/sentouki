<script lang="ts">
import { Search } from ".";
import * as Dialog from "$lib/components/ui/dialog";

let open = false;
</script>

<Dialog.Root bind:open>
    <Dialog.Content>
        <Dialog.Header>
            <Dialog.Title>Search</Dialog.Title>
            <Dialog.Description>
                <Search bind:open />
            </Dialog.Description>
        </Dialog.Header>
    </Dialog.Content>
</Dialog.Root>

<svelte:window
    on:keydown={(e) => {
        if (e.code === 'KeyK' && (e.metaKey || e.ctrlKey)) {
            open = !open
        }
    }}
/>
