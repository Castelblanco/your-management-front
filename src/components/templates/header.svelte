<script lang="ts">
	import TopAppBar, { Row, Section } from '@smui/top-app-bar';
	import LogoBottomMenu from '$organisms/logo_bottom_menu.svelte';
	import P from '$atoms/p.svelte';
	import Separator from '$atoms/separator.svelte';
	import { version } from '$app/environment';
	import ButtonIcon from '$atoms/button_icon.svelte';
	import { appTheme } from '$stores/app_theme';
	import Tooltip from '$atoms/tooltip.svelte';
	import { profileStore } from '$stores/profile';
	import Menu from '@smui/menu';
	import List, { Item, Text } from '@smui/list';
	import { goto } from '$app/navigation';
	import type { LayoutRouteId } from '../../routes/$types';

	export let pathname: LayoutRouteId;
	let menu: Menu;
	let anchor: HTMLDivElement;

	$: iconAppTheme = $appTheme === 'light';
	$: iconAppThemeTooltip = $appTheme === 'light' ? 'Modo Oscuro' : 'Modo Claron';
	$: menuProfileActive = pathname === '/profile';

	const toggleAppTheme = () => appTheme.toogle();
	const toggleMenu = () => menu.setOpen(true);
	const handleGoProfile = () => goto('/profile');
	const handleLogout = () => profileStore.clear();

	addEventListener('click', () => menu.setOpen(false));
</script>

{#if $profileStore !== undefined}
	<TopAppBar variant="static">
		<Row>
			<Section>
				<LogoBottomMenu logo="dark" />
				<P style="margin-left: 20px; font">v.{version}</P>
			</Section>
			<Section style="justify-content: flex-end; padding-right: 30px;">
				<Tooltip content={iconAppThemeTooltip}>
					<ButtonIcon
						icon="dark_mode"
						iconOn="light_mode"
						size="normal"
						iconSize={35}
						bind:pressed={iconAppTheme}
						on:click={toggleAppTheme}
					/>
				</Tooltip>

				<div bind:this={anchor}>
					<ButtonIcon
						style="margin-left: 20px;"
						icon="person"
						size="normal"
						iconSize={35}
						on:click={toggleMenu}
					/>
					<Menu
						anchor={false}
						bind:anchorElement={anchor}
						anchorCorner="BOTTOM_RIGHT"
						bind:this={menu}
					>
						<List>
							<Item on:click={handleGoProfile} activated={menuProfileActive}>
								<Text>Perfil</Text>
							</Item>
							<Separator />
							<Item on:click={handleLogout}>
								<Text>Cerrar Sesión</Text>
							</Item>
						</List>
					</Menu>
				</div>
			</Section>
		</Row>
	</TopAppBar>
{/if}
