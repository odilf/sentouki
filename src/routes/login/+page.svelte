<script lang="ts">
    import LoginForm from "./LoginForm.svelte";

    let { data } = $props();
</script>

<main class="mx-auto max-w-lg px-4 py-8">
    <h1 class="pb-8 text-4xl font-bold">Login</h1>

    <LoginForm data={data.form} action="?/login" />
</main>
