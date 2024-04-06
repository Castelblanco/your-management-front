<script lang="ts">
	import Textfield from '@smui/textfield';
	import HelperText from '@smui/textfield/helper-text';
	import Icon from '@smui/textfield/icon';
	import CharacterCounter from '@smui/textfield/character-counter';
	import type { HTMLInputTypeAttribute } from 'svelte/elements';

	export let label = '';
	export let type: HTMLInputTypeAttribute = 'text';
	export let variant: 'standard' | 'filled' | 'outlined' | undefined = undefined;
	export let style: string | undefined = undefined;
	export let name: string | undefined = undefined;
	export let helperLineStyle: string | undefined = undefined;
	export let value: string | number | null | undefined = '';
	export let invalid: boolean | undefined = undefined;
	export let required: boolean | undefined = undefined;
	export let disabled: boolean | undefined = undefined;
	export let helperText: string | undefined = undefined;
	export let iconLeft: string | undefined = undefined;
	export let iconRight: string | undefined = undefined;
	export let prefix: string | undefined = undefined;
	export let suffix: string | undefined = undefined;
	export let maxLength: number | undefined = undefined;
	export let rangeLength: number | undefined = undefined;
</script>

<Textfield
	{variant}
	bind:value
	{label}
	{invalid}
	{style}
	{required}
	{disabled}
	{prefix}
	{suffix}
	{type}
	input$maxlength={maxLength}
	helperLine$style={helperLineStyle}
	input$name={name}
>
	<svelte:fragment slot="leadingIcon">
		{#if iconLeft}
			<Icon class="material-icons">{iconLeft}</Icon>
		{/if}
	</svelte:fragment>
	{#if helperText}
		<HelperText slot="helper">Helper Text</HelperText>
	{/if}
	{#if rangeLength}
		<CharacterCounter slot="helper">{rangeLength}</CharacterCounter>
	{/if}
	<svelte:fragment slot="trailingIcon">
		{#if iconRight}
			<Icon class="material-icons">{iconRight}</Icon>
		{/if}
	</svelte:fragment>
</Textfield>
