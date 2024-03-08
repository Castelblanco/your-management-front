<script lang="ts" generics="T">
	import Autocomplete from '@smui-extra/autocomplete';
	import { Text } from '@smui/list';
	import CircularProgress from './circular_progress.svelte';

	export let value: string | T | undefined = undefined;
	export let text: string | undefined = undefined;
	export let label: string | undefined = undefined;
	export let style: string | undefined = undefined;
	export let options: T[] = [];
	export let variant: 'outlined' | 'standard' | 'filled' | undefined = undefined;
	export let textfieldStyle: string | undefined = undefined;
	export let showMenuWithNoInput: boolean = false;
	export let disabled: boolean = false;
	export let onSearch: ((input: string) => Promise<false | T[]>) | undefined = undefined;
	export let getOptionLabel: ((options: T) => string) | undefined = undefined;
</script>

<Autocomplete
	bind:value
	bind:text
	{showMenuWithNoInput}
	{style}
	{disabled}
	{label}
	{options}
	{getOptionLabel}
	textfield$variant={variant}
	textfield$style={textfieldStyle}
	search={onSearch}
>
	<Text
		slot="loading"
		style="display: flex; width: 100%; justify-content: center; align-items: center;"
	>
		<CircularProgress style="height: 24px; width: 24px;" indeterminate />
	</Text>
	<Text
		slot="no-matches"
		style="display: flex; width: 100%; justify-content: center; align-items: center;"
	>
		Sin Resultados
	</Text>
</Autocomplete>
