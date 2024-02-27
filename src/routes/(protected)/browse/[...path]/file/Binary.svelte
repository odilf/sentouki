<script lang="ts">
    import { Button } from '$lib/components/ui/button'

    export let serverPath: string

    async function getStream(serverPath: string) {
        const response = await fetch(serverPath)
        const blob = await response.blob()
        return await blob.arrayBuffer()
    }

    // let byteStream: ReadableStream<Uint8Array> | null = null
    let bytes: ArrayBuffer | null = null
</script>

Binary data. UOH File Browser doesn't yet support interesting ways to represent
binary data.
