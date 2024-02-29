<script lang="ts">
	import Tab, { Label } from '@smui/tab';
	import TabBar from '@smui/tab-bar';
	import Citys from '$templates/citys.svelte';
	import Departaments from '$templates/departaments.svelte';

	type TTabs = 'Ciudades' | 'Departamentos';
	let active: TTabs = 'Ciudades';
</script>

<TabBar tabs={['Ciudades', 'Departamentos']} let:tab bind:active>
	<Tab {tab}>
		<Label style="color: #fff;">{tab}</Label>
	</Tab>
</TabBar>

{#if active === 'Ciudades'}
	<Citys />
{:else}
	<Departaments />
{/if}
