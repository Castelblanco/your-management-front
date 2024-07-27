<script lang="ts">
	import Select, { Option } from '@smui/select';
	import type { TSelectOption } from './types';
	import Icon from '@smui/select/icon';

	export let options: TSelectOption[] = [];
	export let icon: string | undefined = undefined;
	export let label: string | undefined = undefined;
	export let value: number | string | undefined;
	export let disabled = false;
	export let required = false;
	export let invalid = false;
	export let variant: 'standard' | 'filled' | 'outlined' | undefined = undefined;
	export let style = '';
	export let key = (item: any) => '';
</script>

<Select
	bind:value
	{disabled}
	{required}
	{variant}
	{invalid}
	{label}
	{style}
	{key}
	color="primary"
>
	{#if icon}
		<Icon class="material-icons" slot="leadingIcon">{icon}</Icon>
	{/if}
	{#each options as { label, value }}
		<Option {value}>{label}</Option>
	{/each}
</Select>
