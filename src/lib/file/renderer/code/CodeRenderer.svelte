<script lang="ts" context="module">
    export const data = {
        filetypes: {
            extensions: (extension) => extension in bundledLanguages,
            mimeTypes: (type) => type.startsWith("text/"),
        },
        name: "code",
        displayName: "Code",
    } as const satisfies Data;
</script>

<script lang="ts">
    import type { Data, Props } from "..";
    import Code from "./Code.svelte";
    import { browser } from "$app/environment";
    import { bundledLanguages, type BundledLanguage } from "shiki";

    let { serverPath }: Props = $props();
    let extension = $derived(serverPath.split(".").at(-1) ?? "");

    function isBundledLanguage(
        extension: string
    ): extension is BundledLanguage {
        return extension in bundledLanguages;
    }

    let lang = $derived(
        isBundledLanguage(extension) ? extension : ("txt" as const)
    );

    async function getFile(serverPath: string) {
        if (!browser) {
            return new Promise<string>(() => {});
        }

        const response = await fetch(serverPath);
        return await response.text();
    }
</script>

<Code code={getFile(serverPath)} {lang} />
