<script lang="ts">
	import IconButton, { Icon } from '@smui/icon-button';

	export let disabled = false;
	export let toggle = false;
	export let pressed = false;
	export let iconOn: string | undefined = undefined;
	export let iconOnSize: number | undefined = undefined;
	export let icon: string | undefined = undefined;
	export let iconSize: number | undefined = undefined;
	export let style: string | undefined = undefined;
	export let size: 'button' | 'normal' | 'mini' | undefined = undefined;
</script>

<IconButton {style} {disabled} {size} {toggle} on:click bind:pressed>
	{#if iconOn}
		<Icon style="font-size: {iconOnSize}px;" class="material-icons" on>{iconOn}</Icon>
	{/if}
	{#if icon}
		<Icon style="font-size: {iconSize}px;" class="material-icons">{icon}</Icon>
	{/if}
</IconButton>
