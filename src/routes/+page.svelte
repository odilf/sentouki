<script lang="ts">
  import { resolve } from "$app/paths";

  let { data } = $props();
</script>

<main class="mx-auto grid h-screen w-fit content-center px-4 py-10">
  <h1 class="text-8xl">sentouki</h1>
  <p class="mb-4">File browser for UOH</p>

  {#if !data.user}
    <a
      class="rounded-sm bg-white px-4 py-2 text-2xl text-black"
      href={resolve("/profile/login")}
    >
      Log in
    </a>
  {:else}
    <a
      class="rounded-sm bg-white px-4 py-2 text-2xl text-black"
      href={resolve("/browse")}
    >
      browse
    </a>

    <a href={resolve("/profile")} class="mt-2"> profile </a>
  {/if}
</main>
