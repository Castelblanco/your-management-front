<script lang="ts">
	import Tab, { Label } from '@smui/tab';
	import TabBar from '@smui/tab-bar';
	import Citys from '$templates/cities.svelte';
	import Departments from '$templates/departments.svelte';

	type TTabs = 'Ciudades' | 'Departmentos';
	let active: TTabs = 'Ciudades';
</script>

<TabBar tabs={['Ciudades', 'Departmentos']} let:tab bind:active>
	<Tab {tab}>
		<Label>{tab}</Label>
	</Tab>
</TabBar>

{#if active === 'Ciudades'}
	<Citys />
{:else}
	<Departments />
{/if}
