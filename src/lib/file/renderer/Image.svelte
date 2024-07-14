<script lang="ts" context="module">
    import { filetypesOf } from "../filetypes";
    export const filetypes = filetypesOf("image");
</script>

<script lang="ts">
    import type { Props } from ".";

    let { serverPath }: Props = $props();
</script>

<img src={serverPath} alt={serverPath} />
