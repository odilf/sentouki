<script lang="ts">
    import VideoPlayer from "$lib/components/ui/video-player/VideoPlayer.svelte";
    let { serverPath }: { serverPath: string } = $props();
</script>

<!-- svelte-ignore a11y_media_has_caption -->
<!-- <video src={serverPath} controls> -->
<!-- 	 -->
<!-- </video> -->

<!-- {#await import('$lib/components/ui/video-player/VideoPlayer.svelte') then {default: Player}} -->
<!--   <svelte:component this={Player} /> -->
<!-- {/await} -->

<VideoPlayer src={serverPath} />
