<script lang="ts" context="module">
    export const data = {
        filetypes: {
            extensions: ["pdf", "obj"],
        },
        name: "objectFullScreen",
        displayName: "Full Screen Object",
    } as const satisfies Data;
</script>

<script lang="ts">
    import type { Data, Props } from ".";

    let { serverPath }: Props = $props();
</script>

<object title={serverPath} class="h-screen w-full">
    <param name="src" value={serverPath} />
    <embed src={serverPath} class="h-full w-full" />
</object>
