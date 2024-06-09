<script lang="ts">
    import { Button } from "$lib/components/ui/button";

    let { serverPath }: { serverPath: string } = $props();

    async function getStream(serverPath: string) {
        const response = await fetch(serverPath);
        const blob = await response.blob();
        return await blob.arrayBuffer();
    }

    // let byteStream: ReadableStream<Uint8Array> | null = null
    // let bytes: ArrayBuffer | null = null
</script>

<Button
    on:click={() => {
        getStream(serverPath);
    }}
>
    Download
</Button>

Binary data. UOH File Browser doesn't yet support interesting ways to represent
binary data.
