<script lang="ts">
    let { serverPath }: { serverPath: string } = $props();
</script>

<object title={serverPath} class="h-screen w-full">
    <param name="src" value={serverPath} />
    <embed src={serverPath} class="h-full w-full" />
</object>
