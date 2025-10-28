<script lang="ts">
  import { resolve } from "$app/paths";
  import type { Directory } from "$lib/server/files";
  import { fly } from "svelte/transition";
  import Breadcrumbs from "./Breadcrumbs.svelte";
  import { formatBytes } from "$lib/fileSize";
  import { goto } from "$app/navigation";

  let {
    dir,
    path,
    animate,
  }: { dir: Directory; path: string; animate: boolean } = $props();

  let selectedIndex: null | number = $state(null);
  let list: HTMLOListElement;

  function moveSelection(delta: number) {
    if (selectedIndex === null) {
      selectedIndex = 0;
    } else {
      selectedIndex =
        (selectedIndex + delta + list.children.length) % list.children.length;
    }
  }
</script>

<svelte:window
  on:keydown={async (event) => {
    if (event.key === "k" && event.metaKey) {
      event.preventDefault();
      // eslint-disable-next-line svelte/no-navigation-without-resolve
      goto(`/search?p=${path}`);
    }

    if (event.key === "j") {
      moveSelection(1);
    } else if (event.key === "k") {
      moveSelection(-1);
    } else if (event.key === "h") {
      goto(
        resolve("/browse/[...path]", {
          path: path.split("/").slice(0, -1).join("/"),
        })
      );
    } else if (event.key === "l" && selectedIndex !== null) {
      const entry = await dir.entries[selectedIndex];
      goto(resolve(`/browse/${path}/${entry.name}`));
    }
  }}
/>

<!-- eslint-disable svelte/no-navigation-without-resolve -->
<header class="mx-auto flex w-fit items-center gap-1 px-4 py-1">
  <Breadcrumbs {path} type="dir" />

  <a
    href="/search?p={path}"
    aria-label="search at directory"
    title="search at directory"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="h-8 rounded-sm p-1 transition hover:bg-white/20"
      ><path d="m21 21-4.34-4.34" /><circle cx="11" cy="11" r="8" /></svg
    >
  </a>
</header>
<main class="mx-auto flex max-w-xl flex-col px-2 py-4">
  <ol class="flex flex-col" bind:this={list}>
    <!-- eslint-disable-next-line svelte/require-each-key -->
    {#each dir.entries as entry, i}
      <li
        class={["p-0", i === selectedIndex && "bg-white/20"]}
        in:fly|global={{
          x: -20,
          delay: 10 * i,
          duration: animate ? 300 + 10 * i : 0,
        }}
      >
        {#await entry}
          Loading...
        {:then entry}
          <a
            class=" flex h-full w-full gap-2 p-3 text-ellipsis transition duration-75 hover:bg-white/5"
            href={resolve(`/browse/${path}/${entry.name}`)}
            title={entry.name}
          >
            <div class="opacity-20">
              {i}
            </div>
            <div class="line-clamp-1 flex-1">
              {entry.name}
            </div>
            <div class="line-clamp-1 w-max">
              {entry.size && formatBytes(entry.size)}
            </div>
          </a>
        {/await}
      </li>
    {/each}
  </ol>
</main>
