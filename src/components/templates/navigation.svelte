<script lang="ts">
	import { navigatorStore } from '$stores/navigator';
	import Drawer, { Content, Header, Scrim } from '@smui/drawer';
	import List, { Item, Text } from '@smui/list';
	import type { LayoutRouteId } from '../../routes/$types';
	import LogoBottomMenu from '$organisms/logo_bottom_menu.svelte';
	import { appTheme } from '$stores/app_theme';

	type TNavigator = {
		label: string;
		icon: string;
		href: LayoutRouteId;
		activated: boolean;
	};

	let navigators: TNavigator[] = [
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
		}
	];

	navigators = navigators.map((nav) => {
		if (nav.href === location.pathname) nav.activated = true;
		return nav;
	});

	const handleActive = (index: number) => {
		navigators.forEach((nav, i) => {
			nav.activated = i === index ? true : false;
		});

		navigators = navigators;
		navigatorStore.toogle();
	};
</script>

<Drawer variant="modal" fixed style="top: 0; width: 300px;" bind:open={$navigatorStore}>
	<Header style="display: flex; align-items: center;">
		<LogoBottomMenu logo={$appTheme} />
	</Header>
	<Content>
		<List>
			{#each navigators as { activated, href, label }, i}
				<Item
					style="display: flex; justify-content: center;"
					href={href || undefined}
					on:click={() => handleActive(i)}
					{activated}
				>
					<Text>{label}</Text>
				</Item>
			{/each}
		</List>
	</Content>
</Drawer>
<Scrim fixed={false} />
