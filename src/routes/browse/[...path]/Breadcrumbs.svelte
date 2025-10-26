<script lang="ts">
  import { resolve } from "$app/paths";
  let { path, type }: { path: string; type: "file" | "dir" } = $props();

  let segments = $derived(path.split("/"));
  function partialPath(i: number) {
    return segments.slice(0, i + 1).join("/");
  }
</script>

<ol class="flex shrink items-baseline">
  {#if path}
    <li class="opacity-50">
      <a href={resolve("/browse")}> ~/ </a>
    </li>
  {/if}
  {#each segments as segment, i (partialPath(i))}
    <li class="line-clamp-1 w-max text-clip">
      {#if i === segments.length - 1}
        <h1 class="ml-1 text-2xl font-semibold">
          {#if path}
            {segments.at(-1)}{type === "file" ? "" : "/"}
          {:else}
            ~/
          {/if}
        </h1>
      {:else}
        <a
          href={resolve(`/browse/${partialPath(i)}`)}
          class="text-sm text-clip opacity-50"
        >
          {segment}/
        </a>
      {/if}
    </li>
  {/each}
</ol>
