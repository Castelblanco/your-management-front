<script lang="ts">
	import { Marker, type Map as IMap } from '@tomtom-international/web-sdk-maps';
	import SeparatorNotLine from '$atoms/separator_not_line.svelte';
	import Switch from '$atoms/switch.svelte';
	import Textfield from '$atoms/textfield.svelte';
	import { callServices } from '$directives/call_services';
	import {
		type TGuideServiceDOM,
		type TGuideServicePointSaleDOM
	} from '$models/guides_service/entities';
	import { statusCodeAdapters } from '$models/status_code/adapters';
	import type { TSelectOption } from '$molecules/types';
	import { getAllStatusCode } from '$services/status_code';

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
	import PointSalePaper from '$molecules/papers/point_sale_paper.svelte';
	import SelectNoHelpertext from '$molecules/select_no_helpertext.svelte';
	import {
		getGuidesServiceNolveties,
		getGuidesServiceTypeServices
	} from '$services/guides_service';
	import { splitNumber } from '$helpers/split_number';

	const {
		cancelEndpoint: cancelEndpointStatus,
		callEndpointList: callEndpointListStatus
	} = callServices();

	const { cancelEndpoint, callEndpointList } = callServices();

	onDestroy(() => {
		cancelEndpointStatus();
		cancelEndpoint();
	});

	export let guideSelected: TGuideServiceDOM;
	export let isCreated: boolean;
	export let mapCtl: IMap;

	let markerList: Marker[] = [];

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

	$: if (naturalClientOriginCheck) legalClientOrigin = undefined;
	else naturalClientOrigin = undefined;

	$: if (guideSelected?.clientOrigin !== undefined) {
		if (guideSelected.clientOrigin.natural) {
			naturalClientOrigin = guideSelected.clientOrigin;
			naturalClientOriginCheck = true;
		} else {
			legalClientOrigin = guideSelected.clientOrigin;
			naturalClientOriginCheck = false;
		}
	}

	$: if (guideSelected?.clientDestination !== undefined) {
		if (guideSelected.clientDestination.natural) {
			naturalClientDestination = guideSelected.clientDestination;
			naturalClientDestinationCheck = true;
		} else {
			legalClientDestination = guideSelected.clientDestination;
			naturalClientDestinationCheck = false;
		}
	}

	$: if (guideSelected.pointSaleOrigin && mapCtl !== undefined) {
		const { latitude, longitude } = guideSelected.pointSaleOrigin;
		markerList.push(new Marker().setLngLat([longitude, latitude]).addTo(mapCtl));
	}

	$: if (guideSelected.pointSaleDestination && mapCtl !== undefined) {
		const { latitude, longitude } = guideSelected.pointSaleDestination;
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

	const handleAddCommodity = () => {
		guideSelected.commodity.push({
			units: 0,
			weight: 0
		});
		guideSelected = guideSelected;
	};

	const handleRemoveCommodity = (index: number) => {
		guideSelected.commodity.splice(index, 1);
		guideSelected = guideSelected;
	};

	const handleFormatPointsSale = (point?: TGuideServicePointSaleDOM) => {
		return point ? point.name : '';
	};

	const handleFormatNaturalClient = (client?: TNaturalClientDOM) => {
		return client ? client.documentId : '';
	};

	const handleFormatLegalClient = (client?: TLegalClientDOM) => {
		return client ? client.nit : '';
	};

	getGuidesStatus();
</script>

<section>
	<Card padded>
		<Paper elevation={0}>
			<Title>Informacion General</Title>
			<SeparatorNotLine style="margin-top: 20px;" />
			<Content>
				<div class="box_general">
					<div class="price">
						<h2>Precio: ${splitNumber(guideSelected.price)}</h2>
					</div>
					<div class="noveties_status">
						<SelectNoHelpertext
							bind:value={guideNoveltyId}
							options={guideNoveltiesOptions}
							variant="outlined"
							label="Novedad"
							disabled={isCreated}
							style="width: 100%;"
						/>
						<SeparatorNotLine style="margin-top: 10px;" />
						<SelectNoHelpertext
							bind:value={guideStatusId}
							options={guideStatusOptions}
							variant="outlined"
							label="Estado"
							disabled={isCreated}
							style="width: 49%;"
						/>
						<SelectNoHelpertext
							bind:value={guideTypeServiceId}
							options={guideTypeServicesOptions}
							variant="outlined"
							disabled={!isCreated}
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
								text={naturalClientOrigin?.documentId}
								getOptionLabel={handleFormatNaturalClient}
								required
								variant="outlined"
								label="Documento"
								onSearch={handleSearchClientNatural}
							/>
						{:else}
							<Autocomplete
								bind:value={legalClientOrigin}
								text={legalClientOrigin?.nit}
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
									<Switch bind:checked={guideSelected.collection} />
									<span>
										{#if guideSelected.collection}
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
								text={naturalClientDestination?.documentId}
								getOptionLabel={handleFormatNaturalClient}
								required
								variant="outlined"
								label="Documento"
								onSearch={handleSearchClientNatural}
							/>
						{:else}
							<Autocomplete
								bind:value={legalClientDestination}
								text={legalClientDestination?.nit}
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
					{#each guideSelected.commodity as commodity, i}
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
								bind:value={guideSelected.pointSaleOrigin}
								text={guideSelected.pointSaleOrigin?.address}
								getOptionLabel={handleFormatPointsSale}
								required
								variant="outlined"
								label="Punto de Origen"
								onSearch={handleSearchPointsSale}
								style="width: 100%;"
								textfieldStyle="width: 100%;"
							/>
							{#if guideSelected.pointSaleOrigin}
								<SeparatorNotLine style="margin-top: 10px;" />
								<PointSalePaper point={guideSelected.pointSaleOrigin} />
							{/if}
						</div>
						<SeparatorNotLine style="margin-top: 20px;" />

						<div>
							<Autocomplete
								bind:value={guideSelected.pointSaleDestination}
								text={guideSelected.pointSaleDestination?.address}
								getOptionLabel={handleFormatPointsSale}
								required
								variant="outlined"
								label="Punto de Destino"
								onSearch={handleSearchPointsSale}
								style="width: 100%;"
								textfieldStyle="width: 100%;"
							/>

							{#if guideSelected.pointSaleDestination}
								<SeparatorNotLine style="margin-top: 10px;" />
								<PointSalePaper point={guideSelected.pointSaleDestination} />
							{/if}
						</div>
					</div>
					<Map bind:mapCtl bind:markerList width={600} height={600} />
				</div>
			</Content>
		</Paper>
	</Card>
</section>

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
