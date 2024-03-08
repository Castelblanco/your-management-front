<script lang="ts">
	import Snackbar from '$organisms/snackbar.svelte';
	import { appTheme } from '$stores/app_theme';
	import Header from '$templates/header.svelte';
	import Navigation from '$templates/navigation.svelte';
	const deviceTheme = matchMedia('(prefers-color-scheme: dark)');

	deviceTheme.addEventListener('change', ({ matches }) => {
		if (matches) $appTheme = 'dark';
		else $appTheme = 'light';
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
	{:else}
		<link rel="stylesheet" href="/smui.css" />
	{/if}
</svelte:head>

<style>
	:global(body) {
		margin: 0;
	}
</style>
