<script lang="ts">
	import Input from '$atoms/input.svelte';
	import Paper from '@smui/paper';
	import Fab from '@smui/fab';
	import { Icon } from '@smui/common';

	export let placeholder: string = '';
	export let value: string | number | null | undefined = undefined;
	export let disabled: boolean | undefined = undefined;
	export const onSubmit = () => {};

	const handleKeyDown = (e: CustomEvent<any> | KeyboardEvent) => {
		e.preventDefault();
		const event = e as KeyboardEvent;
		if (event.key === 'Enter') onSubmit();
	};
</script>

<div class="container">
	<Paper class="solo-paper" elevation={6}>
		<Icon class="material-icons">search</Icon>
		<Input
			bind:value
			on:keydown={handleKeyDown}
			{placeholder}
			{disabled}
			style="flex-grow: 1;"
		/>
	</Paper>
</div>

<style>
	:global(.solo-paper) {
		display: inline-block;
		margin: 0 12px;
	}

	.container {
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
