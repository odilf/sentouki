<script lang="ts" context="module">
    import type { FiletypeValidators } from "$lib/file/filetypes";
    export const filetypes: FiletypeValidators = {
        extensions: (extension) => extension in bundledLanguages,
        mimeTypes: (type) => type.startsWith("text/"),
    };
</script>

<script lang="ts">
    import { bundledLanguages, type BundledLanguage } from "shiki";
    import Code from "./Code.svelte";
    import { browser } from "$app/environment";

    let { serverPath }: { serverPath: string } = $props();
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
