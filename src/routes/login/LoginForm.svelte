<script lang="ts">
    import { formSchema } from "./schema";
    import * as Form from "$lib/components/ui/form";
    import { Input } from "$lib/components/ui/input";
    import {
        type SuperValidated,
        type Infer,
        superForm,
    } from "sveltekit-superforms";
    import { zodClient } from "sveltekit-superforms/adapters";
    import { slide } from "svelte/transition";

    let {
        data,
        action,
    }: {
        data: SuperValidated<Infer<typeof formSchema>>;
        action: string;
    } = $props();

    const form = superForm(data, {
        validators: zodClient(formSchema),
    });

    const { form: formData, enhance, errors } = form;
</script>

<form method="post" use:enhance {action}>
    <Form.Field {form} name="username" class="pb-2">
        <Form.Control let:attrs>
            <Form.Label>Username</Form.Label>
            <Input {...attrs} bind:value={$formData.username} />
        </Form.Control>

        {#if $errors.username}
            <div transition:slide>
                <Form.Description class="text-destructive"
                    >{$errors.username}</Form.Description
                >
            </div>
        {/if}
    </Form.Field>

    <Form.Field {form} name="password" class="pb-4">
        <Form.Control let:attrs>
            <Form.Label>Password</Form.Label>
            <Input {...attrs} type="password" bind:value={$formData.password} />
        </Form.Control>

        {#if $errors.password}
            <div transition:slide>
                <Form.Description class="text-destructive"
                    >{$errors.password}</Form.Description
                >
            </div>
        {/if}
    </Form.Field>

    <Form.Button>Log in</Form.Button>
</form>
