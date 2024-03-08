<script lang="ts">
	import TopAppBar, { Row, Section } from '@smui/top-app-bar';
	import LogoBottomMenu from '$organisms/logo_bottom_menu.svelte';
	import P from '$atoms/p.svelte';
	import { version } from '$app/environment';
	import ButtonIcon from '$atoms/button_icon.svelte';
	import { appTheme } from '$stores/app_theme';
	import Tooltip from '$atoms/tooltip.svelte';

	$: iconAppTheme = $appTheme === 'light';
	$: iconAppThemeTooltip = $appTheme === 'light' ? 'Modo Oscuro' : 'Modo Claron';

	const toggleAppTheme = () => appTheme.toogle();
</script>

<TopAppBar variant="static">
	<Row>
		<Section>
			<LogoBottomMenu />
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
			<ButtonIcon style="margin-left: 20px;" icon="person" size="normal" iconSize={35} />
		</Section>
	</Row>
</TopAppBar>
