<script lang="ts">
  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";
  import { page } from "$app/state";
  import { flip } from "svelte/animate";

  let query = $derived(page.url.searchParams.get("q") ?? undefined);
  let input: HTMLInputElement;

  let results: string[] = $state([]);
  let processing = $state(false);
  const max = 50;

  let activeReader: null | ReadableStreamDefaultReader<
    Uint8Array<ArrayBuffer>
  > = null;
  $effect(() => {
    (async () => {
      if (activeReader) {
        activeReader.cancel();
      }
      processing = true;
      const response = await fetch(
        `/search/query?q=${query}&p=${page.url.searchParams.get("p")}`
      );
      if (!response.ok || !response.body) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      activeReader = reader;
      const decoder = new TextDecoder();
      let buffer = "";
      let resultsCleared = false;

      outer: while (true) {
        const { done, value } = await reader.read();

        if (done) {
          // Process any remaining content in buffer
          if (buffer.length > 0) {
            results.push(buffer);
          }
          break;
        }

        // Decode the chunk and add to buffer
        buffer += decoder.decode(value, { stream: true });

        // Split by newlines and process complete lines
        const lines = buffer.split("\n");

        // Keep the last (potentially incomplete) line in the buffer
        buffer = lines.pop() || "";

        // Clear results right before putting new ones, to prevent flash
        if (!resultsCleared) {
          results = [];
          resultsCleared = true;
        }

        // Process all complete lines
        for (const line of lines) {
          results.push(line);
          if (results.length > max) {
            break outer;
          }
        }
      }

      processing = false;
    })();
  });
</script>

<svelte:window
  on:keydown={(event) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    event;
    // if (event.code === "KeyS") {
    // event.stopPropagation();
    input.focus();
    // }
  }}
/>
<main class="mx-auto max-w-xl px-1 py-8">
  <h1 class="text-5xl font-bold">Search</h1>

  <div>
    <label>
      Query
      <input
        bind:this={input}
        bind:value={query}
        class="my-1 w-full rounded-sm p-2 outline-2 outline-white/20 transition focus:outline-white"
        oninput={() => {
          // eslint-disable-next-line svelte/no-navigation-without-resolve
          goto(`/search?q=${query}&p=${page.url.searchParams.get("p")}`, {
            keepFocus: true,
            replaceState: true,
          });
        }}
      /></label
    >

    <div class={processing ? "opacity-25" : "opacity-0"}>loading...</div>
  </div>

  <ul class="flex flex-col gap-1">
    {#each results as path (path)}
      <li class="p-2" animate:flip={{ duration: 20 }}>
        <a href={resolve("/browse/[...path]", { path })}>
          {path}
        </a>
      </li>
    {/each}
  </ul>
</main>
