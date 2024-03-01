<script lang="ts">
    export let query: string
    import * as Command from '$lib/components/ui/command'

    let results = ['UOH', 'Stuff']
</script>

<Command.Root>
    <Command.Input placeholder="Write file to search for..." />
    <Command.List>
        <Command.Empty>No results found.</Command.Empty>

        {#each results as result}
            <Command.Item>{result}</Command.Item>
        {/each}
    </Command.List>
</Command.Root>
