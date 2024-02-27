import { sveltekit } from '@sveltejs/kit/vite'
import { vite as vidstack } from 'vidstack/plugins'
import { defineConfig } from 'vite'
import topLevelAwait from "vite-plugin-top-level-await";

export default defineConfig({
    plugins: [
        vidstack({ include: /player\// }),
        topLevelAwait({}),
        sveltekit()
    ],
})
