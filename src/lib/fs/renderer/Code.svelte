<script lang="ts" context="module">
    import { browser } from '$app/environment'
    import { getHighlighter, type BundledLanguage } from 'shiki'

    const highlighter = await getHighlighter({
        themes: ['ayu-dark'],
        langs: ['js'],
    })
</script>

<script lang="ts">
    export let serverPath: string
    export let lang: BundledLanguage = serverPath
        .split('.')
        .at(-1) as BundledLanguage

    async function getHtml(serverPath: string) {
        const response = await fetch(serverPath)
        const code = await response.text()
        await highlighter.loadLanguage(lang)
        const file = highlighter.codeToHtml(code, {
            lang,
            theme: 'ayu-dark',
        })

        return String(file)
    }

    let html = browser ? getHtml(serverPath) : new Promise(() => null)
</script>

<section class="text-sm">
    {#await html}
        Loading
    {:then html}
        {@html html}
    {/await}
</section>
