<script lang="ts" context="module">
    import { browser } from '$app/environment'
    import { getHighlighter, type BundledLanguage, type SpecialLanguage } from 'shiki'

    // TODO: Use dynamic fine grained import or something
    // https://shiki.style/guide/install#fine-grained-bundle
    const highlighter = await getHighlighter({
        themes: ['ayu-dark'],
        langs: [], // All are loaded dynamically
    })
</script>

<script lang="ts">
    export let code: Promise<string>
    export let lang: BundledLanguage | SpecialLanguage

    async function getHtml(codePromise: Promise<string>) {
        const code = await codePromise 
        await highlighter.loadLanguage(lang)
        const file = highlighter.codeToHtml(code, {
            lang,
            theme: 'ayu-dark',
        })

        return String(file)
    }

    $: html = browser ? getHtml(code) : new Promise(() => null)
</script>

<section class="text-sm">
    {#await html}
        Loading
    {:then html}
        {@html html}
    {/await}
</section>
