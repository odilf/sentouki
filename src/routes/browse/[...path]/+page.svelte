<script lang="ts">
  import Directory from "./Directory.svelte";
  import File from "./File.svelte";

  let { data } = $props();

  // Show animation after 100 ms of loading.
  // svelte-ignore non_reactive_update
  let animate = false;
  let animateTimeout: null | NodeJS.Timeout = null;
  $effect(() => {
    animate = false;
    if (animateTimeout) {
      clearTimeout(animateTimeout);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    data;
    animateTimeout = setTimeout(() => {
      animate = true;
    }, 100);
  });
</script>

{#await data.entry}
  <div
    class="grid h-screen w-screen content-center text-center text-xl opacity-50"
  >
    Loading {data.path}...
  </div>
{:then entry}
  {#if entry.isDirectory}
    <Directory dir={entry} path={data.path} {animate} />
  {:else}
    <File file={entry} path={data.path} />
  {/if}
{/await}
