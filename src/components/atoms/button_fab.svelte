<script lang="ts">
	import Fab, { Label, Icon } from '@smui/fab';

	export let label: string | undefined = undefined;
	export let icon: string | undefined = undefined;
	export let href: string | undefined = undefined;
	export let style: string | undefined = undefined;
	export let color: 'primary' | 'secondary' | undefined = undefined;
	export let exited: boolean = false;
	export let mini: boolean = false;
	export let extended: boolean = false;
</script>

<Fab
	on:click
	{color}
	{exited}
	{mini}
	{extended}
	{href}
	style={`position: fixed; ${style}`}
>
	{#if icon}
		<Icon class="material-icons">{icon}</Icon>
	{/if}
	{#if label}
		<Label class="material-icons">{label}</Label>
	{/if}
</Fab>
