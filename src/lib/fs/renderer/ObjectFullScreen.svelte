<script lang="ts">
    export let serverPath: string
</script>

<object title={serverPath} class="h-screen w-full">
    <param name="src" value={serverPath} />
    <embed src={serverPath} class="h-full w-full" />
</object>
