<script lang="ts">
  import { enhance } from "$app/forms";
  import type { ActionData } from "./$types";

  let { form }: { form: ActionData } = $props();
</script>

<main class="mx-auto max-w-lg px-1 py-8">
  <h1 class="mb-2 text-2xl font-bold">Login</h1>
  <form class="flex flex-col gap-2" method="post" action="?/login" use:enhance>
    <label class="w-full">
      Username
      <input
        name="username"
        class="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-black shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
    </label>
    <label class="w-full">
      Password
      <input
        type="password"
        name="password"
        class="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-black shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
    </label>
    <button
      class="mt-4 rounded-md bg-blue-200 px-4 py-2 text-black transition hover:bg-blue-400"
      >Login</button
    >
  </form>
  <p style="color: red">{form?.message ?? ""}</p>
</main>
