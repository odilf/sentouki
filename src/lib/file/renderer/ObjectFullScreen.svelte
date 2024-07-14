<script lang="ts" context="module">
    import type { FiletypeValidators } from "../filetypes";
    export const filetypes: FiletypeValidators = {
        extensions: ["pdf", "obj"],
    };
</script>

<script lang="ts">
    import type { Props } from ".";

    let { serverPath }: Props = $props();
</script>

<object title={serverPath} class="h-screen w-full">
    <param name="src" value={serverPath} />
    <embed src={serverPath} class="h-full w-full" />
</object>
