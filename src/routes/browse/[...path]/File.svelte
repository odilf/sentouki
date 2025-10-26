<script lang="ts">
  import { resolve } from "$app/paths";
  import { formatBytes } from "$lib/fileSize";
  import type { File } from "$lib/server/files";
  import Breadcrumbs from "./Breadcrumbs.svelte";
  import Browser from "./renderer/Browser.svelte";
  import PlainText from "./renderer/PlainText.svelte";

  let { file, path }: { file: File; path: string } = $props();
  let raw = $derived(`/raw/${path}` as const);

  function defaultRenderer(mimeType: string | undefined) {
    if (mimeType?.startsWith("text/")) {
      return PlainText;
    } else {
      return Browser;
    }
  }

  const availableRenderers = [
    ["plain text", PlainText],
    ["browser", Browser],
  ] as const;

  let properties = $derived([
    ["Size", file.size == null ? "unknown" : formatBytes(file.size)],
    [
      "Creation date",
      file.creation == null
        ? "unknown"
        : file.creation.toLocaleString("en", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
    ],
    ["MIME type", file.mimeType],
  ]);

  let Renderer = $derived(defaultRenderer(file.mimeType));
  let dialog: HTMLDialogElement;
</script>

<dialog
  bind:this={dialog}
  closedby="any"
  class="mx-auto mt-8 rounded-sm bg-white/70 p-4 text-black backdrop-blur-md"
>
  <div class="grid grid-cols-2 gap-1">
    {#each properties as [name, value] (name)}
      <div class="mr-2 font-light">
        {name}
      </div>
      <div>
        {value}
      </div>
    {/each}
  </div>
  <button
    class="mt-3 w-full rounded bg-black/80 p-1 text-white"
    autofocus
    onclick={() => dialog.close()}>Close</button
  >
</dialog>

<main class="flex h-screen w-[95vw] flex-col items-center">
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

    <button title="file info" onclick={() => dialog.showModal()}>
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
    </button>

    <label class="flex flex-col">
      <div class="text-sm opacity-50">Renderer</div>
      <select name="availableRenderers" bind:value={Renderer}>
        {#each availableRenderers as [name, availableRenderer] (name)}
          <option value={availableRenderer}>{name}</option>
        {/each}
      </select>
    </label>
  </header>

  <div class="w-[80%] flex-1">
    <Renderer {...file} {raw} />
  </div>
</main>
