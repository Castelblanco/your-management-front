<script lang="ts">
	import { navigatorStore } from '$stores/navigator';
	import Drawer, { Content, Header, Scrim } from '@smui/drawer';
	import List, { Item, Text, Graphic } from '@smui/list';
	import type { LayoutRouteId } from '../../routes/$types';
	import LogoBottomMenu from '$organisms/logo_bottom_menu.svelte';

	type TNavigator = {
		label: string;
		icon: string;
		href: LayoutRouteId;
		activated: boolean;
	};

	const navigators: TNavigator[] = [
		{
			href: '/guides_service',
			activated: false,
			icon: '',
			label: 'Guias de Servicio'
		},
		{
			href: '/points_sale',
			activated: false,
			icon: '',
			label: 'Puntos de Venta'
		},
		{
			href: '/users',
			activated: false,
			icon: '',
			label: 'Usuarios'
		},
		{
			href: '/clients',
			activated: false,
			icon: '',
			label: 'Clientes'
		},
		{
			href: '/citys_departaments',
			activated: false,
			icon: '',
			label: 'Cuidades y Departamentos'
		}
	];

	const toggleNavigation = () => navigatorStore.toogle();

	const handleActive = (index: number) => {
		navigators.forEach((nav, i) => {
			if (i === index) nav.activated = true;
			else nav.activated = false;
		});
		navigatorStore.toogle();
	};
</script>

<Drawer variant="modal" fixed style="top: 0; width: 300px;" open={$navigatorStore}>
	<Header style="display: flex; align-items: center;">
		<LogoBottomMenu />
	</Header>
	<Content>
		<List>
			{#each navigators as { activated, href, icon, label }, i}
				<Item href={href || undefined} on:click={() => handleActive(i)} {activated}>
					<Graphic class="material-icons" aria-hidden="true">{icon}</Graphic>
					<Text>{label}</Text>
				</Item>
			{/each}
		</List>
	</Content>
</Drawer>
<Scrim fixed={false} on:click={toggleNavigation} />
