<script lang="ts">
	export let serverPath: string

	let video: HTMLVideoElement
</script>

<!-- svelte-ignore a11y-media-has-caption -->
<video src={serverPath} controls bind:this={video} on:seeked={(e) => {
	console.log("seeeking", e.timeStamp)
	video.fastSeek(e.timeStamp)
}}>
	
</video>
