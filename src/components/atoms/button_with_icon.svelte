<script lang="ts">
	import Button, { Label, Icon } from '@smui/button';

	export let disabled: boolean | undefined = undefined;
	export let color: 'secondary' | 'primary' | undefined = undefined;
	export let variant: 'text' | 'raised' | 'unelevated' | 'outlined' | undefined =
		undefined;
	export let style: string | undefined = undefined;
	export let iconLeft: string | undefined = undefined;
	export let iconRight: string | undefined = undefined;
</script>

<Button {style} aria-disabled={disabled} {color} {variant} on:click>
	{#if iconLeft}
		<Icon class="material-icons">{iconLeft}</Icon>
	{/if}
	<Label>
		<slot />
	</Label>
	{#if iconRight}
		<Icon class="material-icons">{iconRight}</Icon>
	{/if}
</Button>
