<script lang="ts" context="module">
    export const data = {
        filetypes: {
            mimeTypes: ["application/json"],
            extensions: ["json"],
        },
        name: "json",
        displayName: "JSON",
    } as const satisfies Data;
</script>

<script lang="ts">
    import type { Data, Props } from "..";
    import Json from "./Json.svelte";

    let { serverPath }: Props = $props();

    async function getJson(serverPath: string) {
        const response = await fetch(serverPath);
        return await response.json();
    }
</script>

{#await getJson(serverPath) then json}
    <Json {json} />
{/await}
