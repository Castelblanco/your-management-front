<script lang="ts">
	import { goto } from '$app/navigation';
	import Snackbar from '$organisms/snackbar.svelte';
	import { appTheme } from '$stores/app_theme';
	import { profileStore } from '$stores/profile';
	import Header from '$templates/header.svelte';
	import Navigation from '$templates/navigation.svelte';

	$: if (!$profileStore) goto('/auth/login');

	const deviceTheme = matchMedia('(prefers-color-scheme: dark)');
	deviceTheme.addEventListener('change', ({ matches }) => {
		$appTheme = matches ? 'dark' : 'light';
	});
</script>

<Navigation />
<Header />
<slot />
<Snackbar />

<!-- SMUI Styles -->
<svelte:head>
	{#if $appTheme === 'dark'}
		<link rel="stylesheet" href="/smui-dark.css" media="screen" />
		<link rel="icon" href="/favicon-dark.png" />
	{:else}
		<link rel="stylesheet" href="/smui.css" media="screen" />
		<link rel="icon" href="/favicon-light.png" />
	{/if}
</svelte:head>

<style>
	:global(*) {
		outline: none;
	}
	:global(body) {
		margin: 0;
	}
	/* Chrome, Safari, Edge, Opera */
	:global(input::-webkit-outer-spin-button, input::-webkit-inner-spin-button) {
		-webkit-appearance: none;
		margin: 0;
	}

	/* Firefox */
	:global(input[type='number']) {
		-webkit-moz-appearance: textfield;
	}
</style>
