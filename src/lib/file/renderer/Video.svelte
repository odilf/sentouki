<script lang="ts" context="module">
    import type { FiletypeValidators } from "../filetypes";
    export const filetypes: FiletypeValidators = {
        mimeTypes: (type) => type.startsWith("video/"),
    };
</script>

<script lang="ts">
    import VideoPlayer from "$lib/components/ui/video-player/VideoPlayer.svelte";
    import type { Props } from ".";

    let { serverPath }: Props = $props();
</script>

<!-- svelte-ignore a11y_media_has_caption -->
<!-- <video src={serverPath} controls> -->
<!-- 	 -->
<!-- </video> -->

<!-- {#await import('$lib/components/ui/video-player/VideoPlayer.svelte') then {default: Player}} -->
<!--   <svelte:component this={Player} /> -->
<!-- {/await} -->

<VideoPlayer src={serverPath} />
