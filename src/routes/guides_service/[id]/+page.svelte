<script lang="ts">
	import { type Map as IMap } from '@tomtom-international/web-sdk-maps';
	import { callServices } from '$directives/call_services';
	import { guidesServiceAdapters } from '$models/guides_service/adapters/index';
	import type { TGuideServiceDOM } from '$models/guides_service/entities/index';
	import {
		getOneGuideService,
		updateOneGuideService
	} from '$services/guides_service/index';
	import FormGuidesService from '$templates/forms/form_guides_service.svelte';
	import { onDestroy, onMount } from 'svelte';
	import ButtonFab from '$atoms/button_fab.svelte';
	import { validObjects } from '$helpers/valid_objects';
	import { goto } from '$app/navigation';

	const { loading, callEndpointApi, cancelEndpoint } = callServices();

	onDestroy(() => {
		cancelEndpoint();
	});

	onMount(async () => {
		await getGuide();
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

	const handleGoGuides = () => goto('/guides_service');
</script>

<ButtonFab
	color="secondary"
	icon="edit"
	style="position: fixed; bottom: 30px; right: 30px; z-index: 100000000000;"
	loading={$loading}
	exited={enableEdit && !$loading}
	on:click={handleUpdateGuide}
/>

<ButtonFab
	color="secondary"
	icon="arrow_back"
	style="position: absolute; top: 80px; left: 30px; z-index: 100000000000;"
	loading={$loading}
	on:click={handleGoGuides}
/>

{#if guide !== undefined}
	<FormGuidesService bind:mapCtl isCreated={false} bind:guideSelected={guide} />
{/if}
