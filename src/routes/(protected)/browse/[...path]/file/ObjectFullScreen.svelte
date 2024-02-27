<script lang="ts">
	export let serverPath: string
</script>

<object title={serverPath} class="w-full h-screen">
	<param name="src" value={serverPath} />
	<embed src={serverPath} class="w-full h-full"/>
</object>
