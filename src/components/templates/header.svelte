<script lang="ts">
	import TopAppBar, { Row, Section } from '@smui/top-app-bar';
	import LogoBottomMenu from '$organisms/logo_bottom_menu.svelte';
	import P from '$atoms/p.svelte';
	import { version } from '$app/environment';

	export let topAppBar: TopAppBar;
</script>

<TopAppBar variant="static" bind:this={topAppBar}>
	<Row>
		<Section>
			<LogoBottomMenu />
			<P style="margin-left: 20px; font">v.{version}</P>
		</Section>
		<Section></Section>
	</Row>
</TopAppBar>
