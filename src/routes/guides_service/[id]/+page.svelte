<script lang="ts">
	import { type Map as IMap } from '@tomtom-international/web-sdk-maps';
	import { callServices } from '$directives/call_services.js';
	import { guidesServiceAdapters } from '$models/guides_service/adapters/index.js';
	import type { TGuideServiceDOM } from '$models/guides_service/entities/index.js';
	import {
		getOneGuideService,
		updateOneGuideService
	} from '$services/guides_service/index.js';
	import FormGuidesService from '$templates/forms/form_guides_service.svelte';
	import { onDestroy } from 'svelte';
	import CircularLoading from '$atoms/circular_loading.svelte';
	import Tooltip from '$atoms/tooltip.svelte';
	import ButtonFab from '$atoms/button_fab.svelte';
	import { validObjects } from '$helpers/valid_objects.js';

	const { loading, callEndpointApi, cancelEndpoint } = callServices();

	onDestroy(() => {
		cancelEndpoint();
	});

	export let data;

	let mapCtl: IMap;
	let guide: TGuideServiceDOM;
	let guideClone: TGuideServiceDOM;

	$: enableEdit = validObjects(guide, guideClone);

	const getGuide = async () => {
		try {
			guide = await callEndpointApi(
				getOneGuideService(data.id, {
					status: true,
					clientOrigin: true,
					clientDestination: true,
					pointSaleOrigin: true,
					pointSaleDestination: true,
					service: true,
					user: true,
					novelty: true
				}),
				guidesServiceAdapters
			);
			guideClone = structuredClone(guide);
		} catch (e) {
			console.log({ e });
		}
	};

	const handleUpdateGuide = async () => {
		try {
			guide = await callEndpointApi(updateOneGuideService(guide), guidesServiceAdapters);
			guideClone = structuredClone(guide);
		} catch (e) {
			console.log({ e });
		}
	};

	getGuide();
</script>

<Tooltip style="font-size: 15px;" content="Actualizar" yPos="above">
	<ButtonFab
		color="secondary"
		icon="edit"
		style="position: fixed; bottom: 30px; right: 30px; z-index: 100000000000;"
		loading={$loading}
		exited={enableEdit && !$loading}
		on:click={handleUpdateGuide}
	/>
</Tooltip>

{#if guide}
	<FormGuidesService bind:mapCtl isCreated={false} bind:guideSelected={guide} />
{:else}
	<CircularLoading indeterminate />
{/if}

<style>
</style>
