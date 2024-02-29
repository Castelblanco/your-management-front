<script lang="ts">
	import Button, { Label } from '@smui/button';
	import type { LayoutRouteId } from '../../routes/$types';
	import type { HTMLAttributeAnchorTarget } from 'svelte/elements';

	export let disabled: boolean | undefined = undefined;
	export let color: 'secondary' | 'primary' | undefined = undefined;
	export let variant: 'text' | 'raised' | 'unelevated' | 'outlined' | undefined =
		undefined;
	export let style: string | undefined = undefined;
	export let href: LayoutRouteId;
	export let target: HTMLAttributeAnchorTarget | null | undefined = undefined;
</script>

<Button
	href={href !== null ? href : ''}
	{style}
	aria-disabled={disabled}
	{color}
	{variant}
	{target}
>
	<Label>
		<slot />
	</Label>
</Button>
