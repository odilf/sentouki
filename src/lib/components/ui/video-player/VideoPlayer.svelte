<script lang="ts">
    // Import styles.
    import 'vidstack/player/styles/default/theme.css'
    import 'vidstack/player/styles/default/layouts/audio.css'
    import 'vidstack/player/styles/default/layouts/video.css'

    // Register elements.
    import 'vidstack/player'
    import 'vidstack/player/layouts'
    import 'vidstack/player/ui'

    import { onMount } from 'svelte'
    import {
        isHLSProvider,
        type MediaCanPlayEvent,
        type MediaProviderChangeEvent,
    } from 'vidstack'
    import type { MediaPlayerElement } from 'vidstack/elements'

    export let src: string

    let player: MediaPlayerElement

    onMount(() => {
        /**
         * You can add these tracks using HTML as well.
         *
         * @example
         * ```html
         * <media-provider>
         *   <track label="..." src="..." kind="..." srclang="..." default />
         *   <track label="..." src="..." kind="..." srclang="..." />
         * </media-provider>
         * ```
         */
        // for (const track of textTracks) player.textTracks.add(track);

        // Subscribe to state updates.
        return player.subscribe(({ paused, viewType }) => {
            // console.log('is paused?', '->', paused);
            // console.log('is audio view?', '->', viewType === 'audio');
        })
    })

    function onProviderChange(event: MediaProviderChangeEvent) {
        const provider = event.detail
        // We can configure provider's here.
        if (isHLSProvider(provider)) {
            provider.config = {}
        }
    }

    // We can listen for the `can-play` event to be notified when the player is ready.
    function onCanPlay(event: MediaCanPlayEvent) {
        // ...
    }
</script>

<media-player
    class="ring-media-focus aspect-video w-full overflow-hidden rounded-md bg-slate-900 font-sans text-white data-[focus]:ring-4"
    title="Sprite Fight"
    {src}
    playsinline
    on:provider-change={onProviderChange}
    on:can-play={onCanPlay}
    bind:this={player}
>
    <media-provider>
        <!-- <media-poster -->
        <!--     class="absolute inset-0 block h-full w-full rounded-md opacity-0 transition-opacity data-[visible]:opacity-100 [&>img]:h-full [&>img]:w-full [&>img]:object-cover" -->
        <!--     src="https://image.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/thumbnail.webp?time=268&width=1200" -->
        <!--     alt="Girl walks into campfire with gnomes surrounding her friend ready for their next meal!" -->
        <!-- /> -->
    </media-provider>

    <media-audio-layout />
    <media-video-layout />
    <!-- thumbnails="https://image.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/storyboard.vtt" -->
</media-player>

<style lang="postcss">
    .player {
        --brand-color: #f5f5f5;
        --focus-color: #4e9cf6;

        --audio-brand: var(--brand-color);
        --audio-focus-ring-color: var(--focus-color);
        --audio-border-radius: 2px;

        --video-brand: var(--brand-color);
        --video-focus-ring-color: var(--focus-color);
        --video-border-radius: 2px;

        /* 👉 https://vidstack.io/docs/player/components/layouts/default#css-variables for more. */

        &[data-view-type='audio'] media-poster {
            display: none;
        }

        &[data-view-type='video'] {
            aspect-ratio: 16 /9;
        }
    }
</style>
