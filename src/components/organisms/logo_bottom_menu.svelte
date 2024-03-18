<script lang="ts">
	import { appTheme } from '$stores/app_theme';
	import { navigatorStore } from '$stores/navigator';
	import IconButton from '@smui/icon-button';
	import { Image } from '@smui/image-list';

	const toggleNavigation = () => navigatorStore.toogle();

	export let logo: typeof $appTheme;
</script>

<IconButton class="material-icons" on:click={toggleNavigation}>menu</IconButton>
<Image src="/logo-{logo}.png" style="width: 200px; margin-left: 10px;" />
