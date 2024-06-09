<script lang="ts">
    let { serverPath }: { serverPath: string } = $props();
</script>

<img src={serverPath} alt={serverPath} />
