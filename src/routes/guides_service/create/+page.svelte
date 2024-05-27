<script lang="ts">
	import { Marker, type Map as IMap } from '@tomtom-international/web-sdk-maps';
	import SeparatorNotLine from '$atoms/separator_not_line.svelte';
	import Switch from '$atoms/switch.svelte';
	import Textfield from '$atoms/textfield.svelte';
	import { callServices } from '$directives/call_services';
	import {
		type TGuideServiceDOM,
		type TGuideServicePointSaleDOM,
		type TGuideServiceStatusDOM
	} from '$models/guides_service/entities';
	import { statusCodeAdapters } from '$models/status_code/adapters';
	import type { TSelectOption } from '$molecules/types';
	import { getAllStatusCode } from '$services/status_code';
	import { profileStore } from '$stores/profile';
	import FormField from '@smui/form-field';
	import Paper, { Content, Title } from '@smui/paper';
	import { onDestroy } from 'svelte';
	import Map from '$organisms/map.svelte';
	import Card from '@smui/card';
	import Separator from '$atoms/separator.svelte';
	import { getAllNaturalClients } from '$services/clients/natural';
	import { getAllLegalClients } from '$services/clients/legal';
	import Autocomplete from '$atoms/autocomplete.svelte';
	import { naturalClientsAdapters } from '$models/clients/natural/adapters';
	import { legalClientsAdapters } from '$models/clients/legal/adapters';
	import { type TNaturalClientDOM } from '$models/clients/natural/entities';
	import { type TLegalClientDOM } from '$models/clients/legal/entities';
	import ButtonFab from '$atoms/button_fab.svelte';
	import { getAllPointsSale } from '$services/points_sale';
	import { pointsSaleAdapters } from '$models/points_sale/adapters';
	import Tooltip from '$atoms/tooltip.svelte';
	import { snackbarStore } from '$stores/index';
	import { services } from '@tomtom-international/web-sdk-services';
	import { PUBLIC_TOMTOM_API_KEY } from '$env/static/public';
	import PointSalePaper from '$molecules/papers/point_sale_paper.svelte';
	import { createId } from '$tools/index';
	import { liquidationFromPoint } from '$helpers/liquidation_from_point';
	import SelectNoHelpertext from '$molecules/select_no_helpertext.svelte';
	import {
		createOneGuideService,
		getGuidesServiceNolveties,
		getGuidesServiceTypeServices
	} from '$services/guides_service';
	import { splitNumber } from '$helpers/split_number';
	import { guidesServiceAdapters } from '$models/guides_service/adapters';
	import { goto } from '$app/navigation';

	const {
		cancelEndpoint: cancelEndpointStatus,
		loading: loadingStatus,
		callEndpointList: callEndpointListStatus
	} = callServices();

	const { cancelEndpoint, loading, callEndpointList, callEndpointApi } = callServices();

	onDestroy(() => {
		cancelEndpointStatus();
		cancelEndpoint();
	});

	let mapCtl: IMap;
	let markerList: Marker[] = [];

	const resetMakers = () => {
		markerList.forEach((marker) => marker.remove());
		markerList = [];
	};

	let loadingLiquidate = false;
	let routeId = '';
	let naturalClientOriginCheck = true;
	let naturalClientDestinationCheck = true;
	let naturalClientOrigin: TNaturalClientDOM | undefined;
	let naturalClientDestination: TNaturalClientDOM | undefined;
	let legalClientOrigin: TLegalClientDOM | undefined;
	let legalClientDestination: TLegalClientDOM | undefined;
	let guideStatusOptions: TSelectOption[] = [];
	let guideNoveltiesOptions: TSelectOption[] = [];
	let guideTypeServicesOptions: TSelectOption[] = [];
	let guideStatusId = '';
	let guideNoveltyId = '';
	let guideTypeServiceId = '';
	let newGuide: TGuideServiceDOM = {
		id: '',
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

	$: if (newGuide.pointSaleOrigin) {
		const { latitude, longitude } = newGuide.pointSaleOrigin;
		markerList.push(new Marker().setLngLat([longitude, latitude]).addTo(mapCtl));
	}

	$: if (newGuide.pointSaleDestination) {
		const { latitude, longitude } = newGuide.pointSaleDestination;
		markerList.push(new Marker().setLngLat([longitude, latitude]).addTo(mapCtl));
	}

	const getGuidesStatus = async () => {
		try {
			const [status, novelties, servicesType] = await Promise.all([
				callEndpointListStatus(getAllStatusCode('guides_service'), statusCodeAdapters),
				callEndpointListStatus(getGuidesServiceNolveties(), statusCodeAdapters),
				callEndpointListStatus(getGuidesServiceTypeServices(), statusCodeAdapters)
			]);

			guideStatusOptions = status.map((status) => ({
				label: status.name,
				value: status.id
			}));

			guideNoveltiesOptions = novelties.map((status) => ({
				label: status.name,
				value: status.id
			}));

			guideTypeServicesOptions = servicesType.map((status) => ({
				label: status.name,
				value: status.id
			}));
		} catch (e) {
			console.log({ e });
		}
	};

	const handleSearchClientNatural = async (
		search: string
	): Promise<false | TNaturalClientDOM[]> => {
		try {
			if (search === '') return false;

			cancelEndpoint();
			return await callEndpointList(
				getAllNaturalClients({
					documentId: search,
					limit: 10,
					offset: 0
				}),
				naturalClientsAdapters
			);
		} catch (e) {
			console.log({ e });
			return false;
		}
	};

	const handleSearchClientLegal = async (
		search: string
	): Promise<false | TLegalClientDOM[]> => {
		try {
			if (search === '') return false;
			cancelEndpoint();
			return await callEndpointList(
				getAllLegalClients({
					nit: search,
					limit: 10,
					offset: 0
				}),
				legalClientsAdapters
			);
		} catch (e) {
			console.log({ e });
			return false;
		}
	};

	const handleSearchPointsSale = async (
		search: string
	): Promise<false | TGuideServicePointSaleDOM[]> => {
		try {
			if (search === '') return false;
			cancelEndpoint();
			return await callEndpointList(
				getAllPointsSale({
					name: search,
					limit: 10,
					offset: 0
				}),
				pointsSaleAdapters
			);
		} catch (e) {
			console.log({ e });
			return false;
		}
	};

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

	const handleAddCommodity = () => {
		newGuide.commodity.push({
			units: 0,
			weight: 0
		});
		newGuide = newGuide;
	};

	const handleRemoveCommodity = (index: number) => {
		newGuide.commodity.splice(index, 1);
		newGuide = newGuide;
	};

	const handleFormatPointsSale = (point?: TGuideServicePointSaleDOM) =>
		point ? point.name : '';

	const handleFormatNaturalClient = (client?: TNaturalClientDOM) =>
		client ? client.documentId : '';

	const handleFormatLegalClient = (client?: TLegalClientDOM) =>
		client ? client.nit : '';

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

		console.log({ newGuide });

		const guide = await callEndpointApi(
			createOneGuideService(newGuide),
			guidesServiceAdapters
		);

		// goto(`/guides_services/${guide.id}`);
	};

	getGuidesStatus();
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
<section>
	<Card padded>
		<Paper elevation={0}>
			<Title>Informacion General</Title>
			<SeparatorNotLine style="margin-top: 20px;" />
			<Content>
				<div class="box_general">
					<div class="price">
						<h2>Precio: ${splitNumber(newGuide.price)}</h2>
					</div>
					<div class="noveties_status">
						<SelectNoHelpertext
							bind:value={guideNoveltyId}
							options={guideNoveltiesOptions}
							variant="outlined"
							label="Novedad"
							disabled
							style="width: 100%;"
						/>
						<SeparatorNotLine style="margin-top: 10px;" />
						<SelectNoHelpertext
							bind:value={guideStatusId}
							options={guideStatusOptions}
							variant="outlined"
							label="Estado"
							disabled
							style="width: 49%;"
						/>
						<SelectNoHelpertext
							bind:value={guideTypeServiceId}
							options={guideTypeServicesOptions}
							variant="outlined"
							label="Tipo de Servicio"
							style="width: 49%;"
						/>
					</div>
				</div>
			</Content>
		</Paper>
		<Separator />
		<Paper elevation={0}>
			<Title>Datos del Remitente</Title>
			<SeparatorNotLine style="margin-top: 20px;" />
			<Content>
				<FormField>
					<span>Cliente Natural</span>
					<Switch bind:checked={naturalClientOriginCheck} />
					<span>
						{#if naturalClientOriginCheck}
							Si
						{:else}
							No
						{/if}
					</span>
				</FormField>
				<SeparatorNotLine style="margin-top: 10px;" />
				<div class="box_client">
					<div>
						{#if naturalClientOriginCheck}
							<Autocomplete
								bind:value={naturalClientOrigin}
								getOptionLabel={handleFormatNaturalClient}
								required
								variant="outlined"
								label="Documento"
								onSearch={handleSearchClientNatural}
							/>
						{:else}
							<Autocomplete
								bind:value={legalClientOrigin}
								getOptionLabel={handleFormatLegalClient}
								required
								variant="outlined"
								label="Nit"
								onSearch={handleSearchClientLegal}
							/>
						{/if}

						{#if naturalClientOrigin || legalClientOrigin}
							<SeparatorNotLine style="margin-top: 10px;" />
							<div>
								<FormField>
									<span>Requiere Recogida</span>
									<Switch bind:checked={newGuide.collection} />
									<span>
										{#if newGuide.collection}
											Si
										{:else}
											No
										{/if}
									</span>
								</FormField>
							</div>
						{/if}
					</div>
					{#if naturalClientOrigin}
						<Paper elevation={0} style="padding: 0 20px;">
							<Title>
								{naturalClientOrigin.firstName}
								{naturalClientOrigin.lastName}
							</Title>
							<Content>
								Dirección: {naturalClientOrigin.address}
								<SeparatorNotLine />
								Telefono: {naturalClientOrigin.numberMovil}
							</Content>
						</Paper>
					{/if}

					{#if legalClientOrigin}
						<Paper elevation={0} style="padding: 0 20px;">
							<Title>
								{legalClientOrigin.businessName}
							</Title>
							<Content>
								Dirección: {legalClientOrigin.address}
								<SeparatorNotLine />
								Telefono: {legalClientOrigin.numberMovil}
							</Content>
						</Paper>
					{/if}
				</div>
			</Content>
		</Paper>
		<Separator />
		<Paper elevation={0}>
			<Title>Datos del Destinatario</Title>
			<Content>
				<FormField>
					<span>Cliente Natural</span>
					<Switch bind:checked={naturalClientDestinationCheck} />
					<span>
						{#if naturalClientDestinationCheck}
							Si
						{:else}
							No
						{/if}
					</span>
				</FormField>
				<SeparatorNotLine style="margin-top: 10px;" />
				<div class="box_client">
					<div>
						{#if naturalClientDestinationCheck}
							<Autocomplete
								bind:value={naturalClientDestination}
								getOptionLabel={handleFormatNaturalClient}
								required
								variant="outlined"
								label="Documento"
								onSearch={handleSearchClientNatural}
							/>
						{:else}
							<Autocomplete
								bind:value={legalClientDestination}
								getOptionLabel={handleFormatLegalClient}
								required
								variant="outlined"
								label="Nit"
								onSearch={handleSearchClientLegal}
							/>
						{/if}
					</div>
					{#if naturalClientDestination}
						<Paper elevation={0} style="padding: 0 20px;">
							<Title>
								{naturalClientDestination.firstName}
								{naturalClientDestination.lastName}
							</Title>
							<Content>
								Dirección: {naturalClientDestination.address}
								<SeparatorNotLine />
								Telefono: {naturalClientDestination.numberMovil}
							</Content>
						</Paper>
					{/if}

					{#if legalClientDestination}
						<Paper elevation={0} style="padding: 0 20px;">
							<Title>
								{legalClientDestination.businessName}
							</Title>
							<Content>
								Dirección: {legalClientDestination.address}
								<SeparatorNotLine />
								Telefono: {legalClientDestination.numberMovil}
							</Content>
						</Paper>
					{/if}
				</div>
			</Content>
		</Paper>
		<Separator />
		<Paper elevation={0}>
			<Title>Datos de la Mercancia</Title>
			<SeparatorNotLine style="margin-top: 20px;" />
			<Content>
				<div class="commodity_data">
					{#each newGuide.commodity as commodity, i}
						<div class="box">
							<Textfield
								bind:value={commodity.units}
								type="number"
								variant="outlined"
								label="Unidades"
								required
								style="margin-right: 10px;"
							/>
							<Textfield
								bind:value={commodity.weight}
								type="number"
								variant="outlined"
								label="Peso"
								prefix="KG"
								required
								style="margin-right: 10px;"
							/>
							{#if i === 0}
								<ButtonFab
									icon="add"
									color="secondary"
									mini
									on:click={handleAddCommodity}
								/>
							{:else}
								<ButtonFab
									icon="remove"
									color="secondary"
									mini
									on:click={() => handleRemoveCommodity(i)}
								/>
							{/if}
						</div>
					{/each}
				</div>
			</Content>
		</Paper>
		<Separator />
		<Paper elevation={0}>
			<Title>Datos de Envio</Title>
			<SeparatorNotLine style="margin-top: 10px;" />
			<Content>
				<SeparatorNotLine style="margin-top: 10px;" />

				<div class="box_map">
					<div class="points">
						<div>
							<Autocomplete
								bind:value={newGuide.pointSaleOrigin}
								getOptionLabel={handleFormatPointsSale}
								required
								variant="outlined"
								label="Punto de Origen"
								onSearch={handleSearchPointsSale}
								style="width: 100%;"
								textfieldStyle="width: 100%;"
							/>
							{#if newGuide.pointSaleOrigin}
								<SeparatorNotLine style="margin-top: 10px;" />
								<PointSalePaper point={newGuide.pointSaleOrigin} />
							{/if}
						</div>
						<SeparatorNotLine style="margin-top: 20px;" />

						<div>
							<Autocomplete
								bind:value={newGuide.pointSaleDestination}
								getOptionLabel={handleFormatPointsSale}
								required
								variant="outlined"
								label="Punto de Destino"
								onSearch={handleSearchPointsSale}
								style="width: 100%;"
								textfieldStyle="width: 100%;"
							/>

							{#if newGuide.pointSaleDestination}
								<SeparatorNotLine style="margin-top: 10px;" />
								<PointSalePaper point={newGuide.pointSaleDestination} />
							{/if}
						</div>
					</div>
					<Map bind:mapCtl bind:markerList width={600} height={600} />
				</div>
			</Content>
		</Paper>
	</Card>
</section>

<svelte:head>
	<title>Crear Guía</title>
</svelte:head>

<style>
	section {
		width: fit-content;
		margin: 50px auto;

		& .box_general {
			display: flex;
			justify-content: space-between;

			& .price {
				display: flex;
				align-items: center;
			}

			& .noveties_status {
				max-width: 400px;
			}
		}

		& .box_client {
			display: flex;
			justify-content: space-between;
		}

		& form {
			display: flex;
			flex-direction: column;
			max-width: 400px;
			min-width: 300px;
		}

		& .commodity_data {
			display: flex;
			flex-direction: column;
			justify-content: center;

			& .box {
				display: flex;
				justify-content: center;
				align-items: center;
				width: 100%;
				margin-top: 10px;
			}
		}

		& .box_map {
			display: flex;

			& .points {
				display: flex;
				flex-direction: column;
			}
		}
	}
</style>
