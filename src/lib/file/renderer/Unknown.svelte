<script lang="ts" context="module">
    export const data = {
        filetypes: {
            mimeTypes: () => true,
        },
        name: "unknown",
        displayName: "Unknown",
    } as const satisfies Data;
</script>

<script lang="ts">
    import type { Data, Props } from ".";

    let { serverPath }: Props = $props();
</script>

UOH File Browser doesn't know how to render {serverPath}
