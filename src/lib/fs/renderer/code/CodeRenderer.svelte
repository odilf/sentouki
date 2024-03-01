<script lang="ts">
    import { bundledLanguages, type BundledLanguage } from 'shiki'
    import Code from './Code.svelte'

    export let serverPath: string
    export let extension = serverPath.split('.').at(-1) ?? ''

    function isBundledLanguage(
        extension: string
    ): extension is BundledLanguage {
        return extension in bundledLanguages
    }

    $: lang = isBundledLanguage(extension) ? extension : ('txt' as const)

    async function getFile(serverPath: string) {
        const response = await fetch(serverPath)
        return await response.text()
    }
</script>

<Code code={getFile(serverPath)} {lang} />
