<script lang="ts">
  import { resolve } from "$app/paths";
  import type { File } from "$lib/server/files";
  import Breadcrumbs from "./Breadcrumbs.svelte";

  let { file, path }: { file: File; path: string } = $props();
  let raw = $derived(`/raw/${path}` as const);
</script>

<main class="flex h-screen w-screen flex-col items-center">
  <header class="flex h-12 items-end gap-4 px-4 py-1">
    <div class="flex items-baseline gap-1">
      <Breadcrumbs {path} type="file" />
    </div>

    <div class="flex-1"></div>

    <a href={resolve(raw)} download aria-label="download" title="download">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="h-10 rounded-sm p-1 transition hover:bg-white/20"
        ><path d="M12 15V3" /><path
          d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
        /><path d="m7 10 5 5 5-5" /></svg
      >
    </a>

    <div title="file info">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="h-10 rounded-sm p-1 transition hover:bg-white/20"
        ><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path
          d="M12 8h.01"
        /></svg
      >
    </div>
  </header>

  <div class="w-[80%] flex-1">
    <object
      title={file.name}
      data={raw}
      type={file.mimeType}
      class="h-full w-full"
    >
    </object>
  </div>
</main>
