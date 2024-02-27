<script lang="ts" context="module">
    import { browser } from '$app/environment'
    import { getHighlighter } from 'shiki'

    const highlighter = await getHighlighter({
        themes: ['ayu-dark'],
        langs: ['js', 'rs'],
    })
</script>

<script lang="ts">
    import { onMount } from 'svelte'

    export let serverPath: string

    $: lang = serverPath.split('.').at(-1) ?? 'raw'

    async function getHtml(serverPath: string) {
        const response = await fetch(serverPath)
        const code = await response.text()
        const file = highlighter.codeToHtml(code, {
            lang,
            theme: "ayu-dark",
        })

        return String(file)
    }

    let html = browser
        ? getHtml(serverPath)
        : new Promise(() => null)

</script>

{#await html}
    Loading
{:then html} 
    {@html html}
{/await}
