<script lang="ts">
	import Button, { Label } from '@smui/button';

	export let disabled: boolean | undefined = undefined;
	export let color: 'secondary' | 'primary' | undefined = undefined;
	export let variant: 'text' | 'raised' | 'unelevated' | 'outlined' | undefined =
		undefined;
	export let style: string | undefined = undefined;
</script>

<Button {style} aria-disabled={disabled} {color} {variant} on:click>
	<Label>
		<slot />
	</Label>
</Button>
