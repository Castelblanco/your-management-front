<script lang="ts">
	import Tab, { Label } from '@smui/tab';
	import TabBar from '@smui/tab-bar';
	import NaturalClients from '$templates/natural_clients.svelte';
	import LegalClients from '$templates/legal_clients.svelte';

	type TClientType = 'Naturales' | 'Juridicos';

	const listClients: TClientType[] = ['Naturales', 'Juridicos'];

	let active: TClientType = 'Naturales';
</script>

<TabBar tabs={listClients} let:tab bind:active>
	<Tab {tab}>
		<Label>{tab}</Label>
	</Tab>
</TabBar>

<svelte:head>
	<title>Clientes</title>
</svelte:head>

{#if active === 'Naturales'}
	<NaturalClients />
{:else}
	<LegalClients />
{/if}
