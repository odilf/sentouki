<script lang="ts">
  import { enhance } from "$app/forms";
  import type { PageServerData } from "./$types";

  let { data }: { data: PageServerData } = $props();
</script>

<main class="mx-auto max-w-xl px-1 py-8">
  <h1 class="text-3xl">Hi, {data.user.username}!</h1>
  <p>Your user ID is {data.user.id}.</p>

  <form method="post" action="?/logout" use:enhance>
    <button class="rounded-sm bg-white px-4 py-2 text-black">Sign out</button>
  </form>
</main>
