<script lang="ts">
	import { Input } from '@smui/textfield';
	import type { HTMLInputTypeAttribute } from 'svelte/elements';

	export let placeholder = '';
	export let type: HTMLInputTypeAttribute = 'text';
	export let style: string | undefined = undefined;
	export let value: string | number | null | undefined = '';
	export let invalid: boolean | undefined = undefined;
	export let required: boolean | undefined = undefined;
	export let disabled: boolean | undefined = undefined;
</script>

<Input
	on:keydown
	on:keypress
	on:keyup
	bind:value
	{invalid}
	{style}
	{required}
	{disabled}
	{type}
	{placeholder}
/>
