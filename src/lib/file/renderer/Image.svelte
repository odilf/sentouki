<script lang="ts" context="module">
    import { filetypesOf } from "../filetypes";
    export const filetypes = filetypesOf("image");
</script>

<script lang="ts">
    let { serverPath }: { serverPath: string } = $props();
</script>

<img src={serverPath} alt={serverPath} />
