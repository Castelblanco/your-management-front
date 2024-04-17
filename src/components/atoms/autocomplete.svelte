<script lang="ts" generics="T">
	import Autocomplete from '@smui-extra/autocomplete';
	import { Text } from '@smui/list';
	import CircularLoading from './circular_loading.svelte';

	export let value: string | T | undefined = undefined;
	export let text: string = '';
	export let label: string | undefined = undefined;
	export let style: string | undefined = undefined;
	export let options: T[] = [];
	export let variant: 'outlined' | 'standard' | 'filled' | undefined = undefined;
	export let textfieldStyle: string | undefined = undefined;
	export let showMenuWithNoInput: boolean = false;
	export let disabled: boolean = false;
	export let required: boolean = false;
	export let onSearch: ((input: string) => Promise<false | T[]>) | undefined = undefined;
	export let getOptionLabel: ((option: T) => string) | undefined = undefined;
</script>

<Autocomplete
	bind:value
	bind:text
	{showMenuWithNoInput}
	{style}
	{label}
	{disabled}
	{options}
	textfield$required={required}
	search={onSearch}
	{getOptionLabel}
	textfield$variant={variant}
	textfield$style={textfieldStyle}
>
	<Text
		slot="loading"
		style="display: flex; width: 100%; justify-content: center; align-items: center;"
	>
		<CircularLoading style="height: 24px; width: 24px;" indeterminate />
	</Text>
	<Text
		slot="no-matches"
		style="display: flex; width: 100%; justify-content: center; align-items: center;"
	>
		Sin Resultados
	</Text>
</Autocomplete>
