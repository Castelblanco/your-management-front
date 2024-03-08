<script lang="ts">
	import Select, { Option } from '@smui/select';
	import type { TSelectOption } from './types/select';
	import Icon from '@smui/select/icon';

	export let options: TSelectOption[];
	export let icon: string | undefined = undefined;
	export let helperText: string | undefined = undefined;
	export let label: string | undefined = undefined;
	export let style: string | undefined = undefined;
	export let value: number | string;
	export let disabled = false;
	export let required = false;
	export let invalid = false;
	export let variant: 'standard' | 'filled' | 'outlined' | undefined = undefined;
</script>

<Select {disabled} {required} {variant} {invalid} {label} {style} bind:value>
	{#if icon}
		<Icon class="material-icons" slot="leadingIcon">{icon}</Icon>
	{/if}
	<svelte:fragment slot="helperText">
		{#if helperText}
			{helperText}
		{/if}
	</svelte:fragment>
	{#each options as { label, value }}
		<Option {value}>{label}</Option>
	{/each}
</Select>
