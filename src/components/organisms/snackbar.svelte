<script lang="ts">
	import Snackbar, { Actions, Label } from '@smui/snackbar';
	import IconButton from '@smui/icon-button';
	import { snackbarStore } from '$stores/snackbar';

	let snackbarWithClose: Snackbar;

	$: if ($snackbarStore.title !== '') {
		snackbarWithClose.open();
	}
</script>

<Snackbar bind:this={snackbarWithClose}>
	<Label>{$snackbarStore.title}</Label>

	{#if $snackbarStore.closeAction}
		<Actions>
			<IconButton class="material-icons">close</IconButton>
		</Actions>
	{/if}
</Snackbar>
