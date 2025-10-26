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

  let selectedIndex = $state(0);
  let list: HTMLOListElement;

  $effect(() => {
    const child = list.children[selectedIndex] as HTMLLIElement;
    child.focus();
  });
</script>

{selectedIndex}
<svelte:window
  on:keydown={(event) => {
    if (event.key === "k" && event.metaKey) {
      event.preventDefault();
      // eslint-disable-next-line svelte/no-navigation-without-resolve
      goto(`/search?p=${path}`);
    }

    if (event.key === "j") {
      selectedIndex += 1;
    } else if (event.key === "k") {
      selectedIndex -= 1;
    }
  }}
/>

<header class="mx-auto flex w-fit items-baseline gap-1 px-4 py-1">
  <Breadcrumbs {path} type="dir" />
</header>
<main class="mx-auto flex max-w-xl flex-col px-2 py-4">
  <ol class="flex flex-col" bind:this={list}>
    <!-- eslint-disable-next-line svelte/require-each-key -->
    {#each dir.entries as entry, i}
      <li
        class="p-0 focus:bg-white/20"
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
