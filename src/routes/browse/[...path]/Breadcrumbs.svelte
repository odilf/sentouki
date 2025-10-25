<script lang="ts">
  import { resolve } from "$app/paths";
  // import { crossfade, fly, scale } from "svelte/transition";

  let { path, type }: { path: string; type: "file" | "dir" } = $props();

  let segments = $derived(path.split("/"));
  function partialPath(i: number) {
    return segments.slice(0, i + 1).join("/");
  }

  // const [send, receive] = crossfade({
  //   fallback: (node) => scale(node, { start: 0.9 }),
  // });
</script>

<ol class="flex items-baseline">
  {#if path}
    <li class="opacity-50">
      <a href={resolve("/browse")}> ~/ </a>
    </li>
  {/if}
  {#each segments as segment, i (partialPath(i))}
    <!-- <li out:send|global={{ key: i }} in:receive|global={{ key: i }}> -->
    <li>
      {#if i === segments.length - 1}
        <h1 class="ml-1 text-3xl font-bold">
          {#if path}
            {segments.at(-1)}{type === "file" ? "" : "/"}
          {:else}
            ~/
          {/if}
        </h1>
      {:else}
        <a href={resolve(`/browse/${partialPath(i)}`)} class="opacity-50">
          {segment}/
        </a>
      {/if}
    </li>
  {/each}
</ol>
