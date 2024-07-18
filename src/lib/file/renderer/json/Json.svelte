<script lang="ts">
    import { slide } from "svelte/transition";

    type Props = {
        json: unknown;
        parent?: string;
        addComa?: boolean;
        depth?: number;
        expanded?: boolean;
    };

    let {
        json,
        parent,
        addComa = false,
        depth = 0,
        expanded = $bindable(depth < 3),
    }: Props = $props();

    let prologue = $derived(parent ? `${parent}:` : "");
    let epilogue = addComa ? "," : "";
</script>

{#snippet list(json: object | unknown[])}
    {@const array = Array.isArray(json)}
    <button
        class="text-left flex flex-col hover rounded transition w-full"
        onclick={(event) => {
            event.stopPropagation();
            expanded = !expanded;
        }}
    >
        <div>
            {prologue}
            {array ? "[" : "{"}
        </div>
        {#if expanded}
            <ul class="pl-4" transition:slide>
                {#if array}
                    {#each json as value}
                        <li>
                            <svelte:self
                                json={value}
                                addComa
                                depth={depth + 1}
                            />
                        </li>
                    {/each}
                {:else}
                    {#each Object.entries(json) as [key, value]}
                        <li>
                            <svelte:self
                                json={value}
                                parent={key}
                                depth={depth + 1}
                            />
                        </li>
                    {/each}
                {/if}
            </ul>
        {/if}
        <div>{array ? "]" : "}"} {epilogue}</div>
    </button>
{/snippet}

{#if typeof json === "undefined"}
    undefined
{:else if typeof json === "object"}
    {#if json === null}
        <div>null</div>
    {:else}
        {@render list(json)}
    {/if}
{:else if typeof json === "string"}
    {prologue} "{json}" {epilogue}
{:else}
    {prologue} {json} {epilogue}
{/if}

<style lang="postcss">
    .hover:hover:not(:has(.hover:hover)) {
        @apply bg-secondary/80;
    }
</style>
