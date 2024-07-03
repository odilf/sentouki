<script lang="ts" context="module">
    import type { FiletypeValidators } from "../filetypes";
    export const filetypes: FiletypeValidators = {
        mimeTypes: () => true,
    };
</script>

<script lang="ts">
    let { serverPath }: { serverPath: string } = $props();
</script>

UOH File Browser doesn't know how to render {serverPath}
