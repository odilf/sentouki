import { sveltekit } from '@sveltejs/kit/vite'
import { vite as vidstack } from 'vidstack/plugins'
import { defineConfig } from 'vite'
import topLevelAwait from 'vite-plugin-top-level-await'
import { ViteFaviconsPlugin } from 'vite-plugin-favicon2';

export default defineConfig({
    plugins: [
        ViteFaviconsPlugin("./static/favicon.svg"),
        vidstack({ include: /player\// }),
        topLevelAwait({}),
        sveltekit(),
    ],
})
