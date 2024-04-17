<script lang="ts">
	import { profileStore } from '$stores/profile';
</script>

<h1>profile</h1>

<svelte:head>
	<title>{$profileStore?.firstName} {$profileStore?.lastName}</title>
</svelte:head>

<style>
</style>
