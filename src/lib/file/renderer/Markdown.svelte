<script lang="ts" context="module">
    import type { FiletypeValidators } from "../filetypes";
    export const filetypes: FiletypeValidators = {
        extensions: ["md", "markdown"],
    };

    import { unified } from "unified";
    import remarkParse from "remark-parse";
    import remarkGfm from "remark-gfm";
    import remarkRehype from "remark-rehype";
    import rehypeStringify from "rehype-stringify";
    import rehypeShiki from "@shikijs/rehype";

    const processor = unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkRehype)
        .use(rehypeShiki, {
            theme: "ayu-dark",
        })
        .use(rehypeStringify);
</script>

<script lang="ts">
    import type { Props } from ".";
    import { browser } from "$app/environment";

    let { serverPath }: Props = $props();

    async function getHtml(serverPath: string) {
        const response = await fetch(serverPath);
        const content = await response.text();
        const file = await processor.process(content);

        return String(file);
    }

    let html = browser ? getHtml(serverPath) : new Promise(() => null);
</script>

<!--
    @component
    
    Component for rendering markdown. 

    Supported extensions:
    - Github flavored markdown (GFM)
    - Code blocks with shiki
-->

<section class="mx-auto max-w-xl">
    {#await html}
        Loading
    {:then html}
        {@html html}
    {/await}
</section>

<style lang="postcss">
    section {
        :global(h1) {
            @apply my-4 text-3xl font-bold;
        }

        :global(h2) {
            @apply my-4 text-2xl font-bold;
        }

        :global(h3) {
            @apply my-2 text-xl font-bold;
        }

        :global(*) {
            @apply mb-2;
        }

        :global(p) {
            @apply mb-2 text-justify opacity-85;
        }

        :global(li) {
            @apply ml-[2ch] list-disc;
        }

        :global(ul) {
            @apply list-decimal;
        }
    }
</style>
