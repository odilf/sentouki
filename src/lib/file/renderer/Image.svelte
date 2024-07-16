<script lang="ts" context="module">
    import { filetypesOf } from "../filetypes";
    export const data = {
        filetypes: filetypesOf("image"),
        name: "image",
        displayName: "Image",
    } as const satisfies Data;
</script>

<script lang="ts">
    import type { Data, Props } from ".";

    let { serverPath }: Props = $props();
</script>

<img src={serverPath} alt={serverPath} />
