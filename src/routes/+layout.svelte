<script lang="ts">
	import { appTheme } from '$stores/app_theme';
	import Header from '$templates/header.svelte';
	import Navigation from '$templates/navigation.svelte';
	import TopAppBar, { AutoAdjust } from '@smui/top-app-bar';

	let topAppBar: TopAppBar;
</script>

<Navigation />
<Header {topAppBar} />
<AutoAdjust {topAppBar}>
	<main>
		<slot />
	</main>
</AutoAdjust>

<!-- SMUI Styles -->
{#if $appTheme === 'dark'}
	<link
		rel="stylesheet"
		href="/smui-dark.css"
		media="screen and (prefers-color-scheme: dark)"
	/>
{:else}
	<link rel="stylesheet" href="/smui.css" media="(prefers-color-scheme: light)" />
{/if}

<style>
	:global(body) {
		margin: 0;
	}
</style>
