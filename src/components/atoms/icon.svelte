<script lang="ts">
	import { Icon } from '@smui/common';
	export let style = '';
	export let icon: string;
</script>

<Icon {style} class="material-icons" color="primary">
	{icon}
</Icon>
