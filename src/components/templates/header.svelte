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
	import ProfileView from '$organisms/profile_view.svelte';
	import ModalCropper from '$organisms/modal_cropper.svelte';
	import { UserPictureDOM, type TUserPictureDOM } from '$models/users/entities';
	import { updateOneUserPicture } from '$services/users';

	let menu: Menu;
	let anchor: HTMLDivElement;
	let fileList: FileList;
	let showCropper = false;
	let loadingPicture = false;
	let inputFile: HTMLInputElement;
	let userPicture: TUserPictureDOM = {
		id: '',
		url: ''
	};

	$: if (userPicture.url !== '') updateUserPicture();

	$: iconAppTheme = $appTheme === 'light';
	$: iconAppThemeTooltip = $appTheme === 'light' ? 'Modo Oscuro' : 'Modo Claron';

	const updateUserPicture = async () => {
		try {
			if (!$profileStore) return;
			openMenu();
			loadingPicture = true;
			const { response } = await updateOneUserPicture($profileStore.id, userPicture);
			const { item } = (await response).data;

			$profileStore.picture = new UserPictureDOM({
				id: item._id,
				url: item.url
			});
		} catch (e) {
			console.log({ e });
		} finally {
			loadingPicture = false;
		}
	};

	const toggleAppTheme = () => appTheme.toogle();
	const openMenu = () => menu.setOpen(true);
	const handleLogout = () => profileStore.clear();
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
						on:click={openMenu}
					/>
					<Menu
						anchor={false}
						bind:anchorElement={anchor}
						anchorCorner="BOTTOM_RIGHT"
						bind:this={menu}
					>
						<ProfileView loading={loadingPicture} bind:fileList bind:inputFile />
						<Separator />
						<List>
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

<ModalCropper
	bind:open={showCropper}
	bind:fileList
	bind:imageCrop={userPicture.url}
	bind:inputFile
/>
