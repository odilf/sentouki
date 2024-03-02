<script lang="ts">
    import { Command as CommandPrimitive } from 'cmdk-sv'
    import { cn } from '$lib/utils'

    type $$Props = CommandPrimitive.ListProps
    let className: string | undefined | null = undefined
    export { className as class }
</script>

<CommandPrimitive.List
    class={cn('h-75vh overflow-y-auto overflow-x-hidden', className)}
    {...$$restProps}
>
    <slot />
</CommandPrimitive.List>
