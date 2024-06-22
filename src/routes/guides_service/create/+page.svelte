<script lang="ts">
	import { type Map as IMap } from '@tomtom-international/web-sdk-maps';
	import { callServices } from '$directives/call_services';
	import { type TGuideServiceDOM } from '$models/guides_service/entities';
	import type { TSelectOption } from '$molecules/types';
	import { profileStore } from '$stores/profile';
	import { onDestroy } from 'svelte';
	import { type TNaturalClientDOM } from '$models/clients/natural/entities';
	import { type TLegalClientDOM } from '$models/clients/legal/entities';
	import ButtonFab from '$atoms/button_fab.svelte';
	import Tooltip from '$atoms/tooltip.svelte';
	import { snackbarStore } from '$stores/index';
	import { services } from '@tomtom-international/web-sdk-services';
	import { PUBLIC_TOMTOM_API_KEY } from '$env/static/public';
	import { createId } from '$tools/index';
	import { liquidationFromPoint } from '$helpers/liquidation_from_point';
	import { createOneGuideService } from '$services/guides_service';
	import { guidesServiceAdapters } from '$models/guides_service/adapters';
	import { goto } from '$app/navigation';
	import FormGuidesService from '$templates/forms/form_guides_service.svelte';

	const { cancelEndpoint: cancelEndpointStatus } = callServices();

	const { cancelEndpoint, loading, callEndpointApi } = callServices();

	onDestroy(() => {
		cancelEndpointStatus();
		cancelEndpoint();
	});

	let mapCtl: IMap;

	let loadingLiquidate = false;
	let routeId = '';
	let naturalClientOriginCheck = true;
	let naturalClientOrigin: TNaturalClientDOM | undefined;
	let naturalClientDestination: TNaturalClientDOM | undefined;
	let legalClientOrigin: TLegalClientDOM | undefined;
	let legalClientDestination: TLegalClientDOM | undefined;
	let guideStatusOptions: TSelectOption[] = [];
	let guideNoveltiesOptions: TSelectOption[] = [];
	let guideTypeServiceId = '';
	let newGuide: TGuideServiceDOM = {
		id: '',
		number: 0,
		commodity: [
			{
				units: 0,
				weight: 0
			}
		],
		price: 0,
		collection: false,
		createdAt: new Date(),
		updatedAt: new Date(),
		user: $profileStore
	};

	$: if (naturalClientOriginCheck) legalClientOrigin = undefined;
	else naturalClientOrigin = undefined;

	const handleLiquidate = async () => {
		try {
			loadingLiquidate = true;
			const checkCommodity = newGuide.commodity.some(
				(com) => com.units === 0 || com.weight === 0
			);

			if (checkCommodity) {
				snackbarStore.change({
					title: 'Datos de Mercaciona Invalidos',
					closeAction: true
				});
				return;
			}

			if (!newGuide.pointSaleOrigin || !newGuide.pointSaleDestination) {
				snackbarStore.change({
					title: 'Datos de Envio Invalidos',
					closeAction: true
				});
				return;
			}

			await getRoutePointsSales();
		} catch (e) {
			console.log({ e });
		} finally {
			loadingLiquidate = false;
		}
	};

	const getRoutePointsSales = async () => {
		if (!newGuide.pointSaleOrigin || !newGuide.pointSaleDestination) return;

		if (routeId) mapCtl.removeLayer(routeId);

		const res = await services.calculateRoute({
			key: PUBLIC_TOMTOM_API_KEY,
			locations: [
				[newGuide.pointSaleOrigin.longitude, newGuide.pointSaleOrigin.latitude],
				[newGuide.pointSaleDestination.longitude, newGuide.pointSaleDestination.latitude]
			]
		});

		const [route] = res.routes;

		const { lengthInMeters } = route.summary;
		newGuide.price = liquidationFromPoint(newGuide.commodity, lengthInMeters);

		routeId = createId();
		mapCtl.addLayer({
			id: routeId,
			type: 'line',
			source: {
				type: 'geojson',
				data: res.toGeoJson()
			},
			layout: {
				'line-cap': 'round',
				'line-join': 'round'
			},
			paint: {
				'line-color': '#ff0000',
				'line-width': 2
			}
		});

		mapCtl.setCenter([
			newGuide.pointSaleOrigin.longitude,
			newGuide.pointSaleOrigin.latitude
		]);
		mapCtl.setZoom(12);
	};

	const handleCreateGuide = async () => {
		const novelty = guideNoveltiesOptions.find(({ label }) => label === 'N/A');
		const status = guideStatusOptions.find(({ label }) => label === 'Activo');
		newGuide.novelty = {
			id: `${novelty?.value}`,
			name: ''
		};
		newGuide.status = {
			id: `${status?.value}`,
			name: ''
		};
		newGuide.service = {
			id: guideTypeServiceId,
			name: ''
		};

		newGuide.clientOrigin = naturalClientOrigin || legalClientOrigin;
		newGuide.clientDestination = naturalClientDestination || legalClientDestination;
		newGuide.createdAt = new Date();
		newGuide.updatedAt = new Date();

		const guide = await callEndpointApi(
			createOneGuideService(newGuide),
			guidesServiceAdapters
		);

		goto(`/guides_service/${guide.id}`);
	};
</script>

<Tooltip style="font-size: 15px;" content="Liquidar" yPos="above">
	<ButtonFab
		color="secondary"
		icon="attach_money"
		style="position: fixed; bottom: 100px; right: 30px; z-index: 100;"
		on:click={handleLiquidate}
		loading={loadingLiquidate}
	/>
</Tooltip>
<Tooltip style="font-size: 15px;" content="Crear Guia" yPos="above">
	<ButtonFab
		color="secondary"
		icon="add"
		style="position: fixed; bottom: 30px; right: 30px; z-index: 100000000000;"
		loading={$loading}
		on:click={handleCreateGuide}
	/>
</Tooltip>

<FormGuidesService bind:mapCtl isCreated bind:guideSelected={newGuide} />

<svelte:head>
	<title>Crear Guía</title>
</svelte:head>
