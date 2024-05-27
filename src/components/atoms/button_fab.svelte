<script lang="ts">
	import Fab, { Label, Icon } from '@smui/fab';
	import CircularLoading from './circular_loading.svelte';

	export let label: string | undefined = undefined;
	export let icon: string | undefined = undefined;
	export let href: string | undefined = undefined;
	export let style: string | undefined = undefined;
	export let color: 'primary' | 'secondary' | undefined = undefined;
	export let exited: boolean = false;
	export let mini: boolean = false;
	export let extended: boolean = false;
	export let loading: boolean = false;
</script>

<Fab on:click {color} {exited} {mini} {extended} {href} {style}>
	{#if icon && !loading}
		<Icon class="material-icons">{icon}</Icon>
	{/if}
	{#if label && !loading}
		<Label class="material-icons">{label}</Label>
	{/if}
	{#if loading}
		<CircularLoading style="width: 40px; height: 40px;" indeterminate />
	{/if}
</Fab>
