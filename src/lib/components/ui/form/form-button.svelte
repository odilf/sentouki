<script lang="ts">
import type * as Button from "$lib/components/ui/button";

type $$Props = Button.Props;
</script>

<Button.Root type="submit" {...$$restProps}>
    <slot />
</Button.Root>
