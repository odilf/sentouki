<script lang="ts">
    import VideoPlayer from '$lib/components/ui/video-player/VideoPlayer.svelte'
    export let serverPath: string

    let video: HTMLVideoElement
</script>

<!-- svelte-ignore a11y-media-has-caption -->
<!-- <video src={serverPath} controls> -->
<!-- 	 -->
<!-- </video> -->

<!-- {#await import('$lib/components/ui/video-player/VideoPlayer.svelte') then {default: Player}} -->
<!--   <svelte:component this={Player} /> -->
<!-- {/await} -->

<VideoPlayer src={serverPath} />
