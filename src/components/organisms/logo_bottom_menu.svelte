<script lang="ts">
	import { navigatorStore } from '$stores/navigator';
	import IconButton from '@smui/icon-button';
	import { Image } from '@smui/image-list';

	const toggleNavigation = () => navigatorStore.toogle();
</script>

<IconButton class="material-icons" on:click={toggleNavigation}>menu</IconButton>
<Image src="/logo.png" style="width: 200px; margin-left: 10px;" />
