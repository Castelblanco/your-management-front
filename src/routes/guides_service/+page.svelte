<script lang="ts">
	import Card from '@smui/card';
	import DataTable, { Body, Cell, Head, Label, Pagination, Row } from '@smui/data-table';
	import IconButton from '@smui/icon-button';
	import LinearLoading from '$atoms/linear_loading.svelte';
	import { callServices } from '$directives/call_services';
	import { onDestroy, onMount } from 'svelte';
	import P from '$atoms/p.svelte';
	import { statusCodeAdapters } from '$models/status_code/adapters';
	import TextfieldWithIcon from '$atoms/textfield_wih_icon.svelte';
	import type { TSelectOption } from '$molecules/types/select';
	import SelectNoHelpertext from '$molecules/select_no_helpertext.svelte';
	import { getAllStatusCode } from '$services/status_code';
	import ButtonFab from '$atoms/button_fab.svelte';
	import SeparatorNotLine from '$atoms/separator_not_line.svelte';
	import { addCommodityUnits, formatDateView } from '$helpers/index';
	import type { TUserFilterDOM } from '$models/users/entities';
	import { goto } from '$app/navigation';
	import {
		getAllGuidesService,
		getGuidesServiceNolveties,
		getGuidesServiceTypeServices
	} from '$services/guides_service';
	import { guidesServiceAdapters } from '$models/guides_service/adapters';
	import type { TGuideServiceDOM } from '$models/guides_service/entities';
	import { profileStore } from '$stores/profile';
	import Textfield from '$atoms/textfield.svelte';
	import Select from '$molecules/select.svelte';

	const { callEndpointList, loading, callEndpointApi, cancelEndpoint } = callServices();
	const {
		callEndpointList: callEndpointListStatus,
		loading: loadingStatus,
		cancelEndpoint: cancelEndpointStatus
	} = callServices();
	const {
		callEndpointList: callEndpointListUserRoles,
		loading: loadingUserRoles,
		cancelEndpoint: cancelEndpointUserRoles
	} = callServices();

	onDestroy(() => {
		cancelEndpoint();
		cancelEndpointStatus();
		cancelEndpointUserRoles();
	});

	onMount(() => {
		getNoveltiesAndServicesType();
		getStatusCode();
	});

	const pagesOptions: TSelectOption[] = [
		{
			label: '10',
			value: 10
		},
		{
			label: '50',
			value: 50
		},
		{
			label: '100',
			value: 100
		}
	];
	let filters: TUserFilterDOM = {
		firstName: '',
		lastName: '',
		documentId: '',
		email: '',
		limit: 10,
		offset: 0,
		status: true
	};
	let filterStatus: string = '';
	let filterNovelty: string = '';
	let filterServicesType: string = '';
	let guides: TGuideServiceDOM[] = [];
	let statusCode: TSelectOption[] = [];
	let noveltiesFilter: TSelectOption[] = [];
	let servicesTypeFilter: TSelectOption[] = [];
	let startTime = '';
	let endTime = '';

	// Pagination
	let rowsPerPage = 10;
	let page = 0;
	$: start = page * rowsPerPage;
	$: end = Math.min(start + rowsPerPage, guides.length);
	$: lastPage = Math.max(Math.ceil(guides.length / rowsPerPage) - 1, 0);
	$: if (page > lastPage) page = lastPage;

	const getStatusCode = async () => {
		try {
			const status = await callEndpointListStatus(
				getAllStatusCode('guides_service'),
				statusCodeAdapters
			);
			const statusMap = status.map(({ name, id }) => ({ label: name, value: id }));

			statusCode = [
				{
					label: '',
					value: ''
				},
				...statusMap
			];
		} catch (e) {
			console.log({ e });
		}
	};

	const getNoveltiesAndServicesType = async () => {
		try {
			const {
				data: { items: novelties }
			} = await getGuidesServiceNolveties().response;
			const {
				data: { items: servicesType }
			} = await getGuidesServiceTypeServices().response;

			const moveltiesMap = novelties.map(({ name, _id }) => ({
				label: name,
				value: _id
			}));

			const servicesTypeMap = servicesType.map(({ name, _id }) => ({
				label: name,
				value: _id
			}));

			noveltiesFilter = [
				{
					label: '',
					value: ''
				},
				...moveltiesMap
			];
			servicesTypeFilter = [
				{
					label: '',
					value: ''
				},
				...servicesTypeMap
			];
		} catch (e) {
			console.log({ e });
		}
	};

	const handleSearchGuide = async (
		startTime: string,
		endTime: string,
		statusId?: string,
		noveltyId?: string,
		serviceId?: string
	) => {
		try {
			const startDate = startTime ? new Date(startTime) : new Date();
			if (!startTime) startDate.setDate(1);
			const endDate = endTime
				? new Date(endTime)
				: new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

			guides = await callEndpointList(
				getAllGuidesService({
					...filters,
					userId: $profileStore?.id || '',
					limit: 50,
					offset: 0,
					status: true,
					clientOrigin: true,
					clientDestination: true,
					pointSaleOrigin: true,
					pointSaleDestination: true,
					service: true,
					startDate: startDate.getTime(),
					endDate: endDate.getTime(),
					statusId,
					noveltyId,
					serviceId
				}),
				guidesServiceAdapters
			);
		} catch (e) {
			console.log({ e });
		}
	};

	const handleSelectGuide = (guide: TGuideServiceDOM) => {
		goto(`/guides_service/${guide.id}`);
	};

	const handleCreateUser = () => goto('/guides_service/create');

	const handleAddPage = () => page++;
	const handleSubtractPage = () => page--;
	const handleFirstPage = () => (page = 0);
	const handleLastPage = () => (page = lastPage);

	$: handleSearchGuide(
		startTime,
		endTime,
		filterStatus,
		filterNovelty,
		filterServicesType
	);
</script>

<ButtonFab
	on:click={handleCreateUser}
	style="position: fixed; bottom: 30px; right: 30px;"
	icon="add"
/>
<section>
	<Card padded>
		<form
			on:submit|preventDefault={() =>
				handleSearchGuide(
					startTime,
					endTime,
					filterStatus,
					filterNovelty,
					filterServicesType
				)}
		>
			<div class="box_inputs">
				<Textfield
					type="datetime-local"
					bind:value={startTime}
					label="Fecha de Inicio"
					variant="outlined"
					style="width: 32%;"
				/>
				<Textfield
					type="datetime-local"
					bind:value={endTime}
					label="Fecha Final"
					variant="outlined"
					style="width: 32%;"
				/>
				<Select
					bind:value={filterStatus}
					options={statusCode}
					label="Estado"
					variant="outlined"
					style="width: 32%;"
				/>
			</div>
			<SeparatorNotLine style="margin-top: 10px;" />
			<div class="box_inputs">
				<Select
					bind:value={filterServicesType}
					options={servicesTypeFilter}
					label="Tipo de Servicio"
					variant="outlined"
					style="width: 45%;"
				/>
				<Select
					bind:value={filterNovelty}
					options={noveltiesFilter}
					label="Novedad"
					variant="outlined"
					style="width: 45%;"
				/>
			</div>

			<button type="submit" style="display: none;"></button>
		</form>

		<SeparatorNotLine style="margin: 20px 0;" />

		{#if statusCode.length > 0}
			<Pagination>
				<svelte:fragment slot="rowsPerPage">
					<Label>Filas por Pagina</Label>
					<SelectNoHelpertext
						options={pagesOptions}
						value={rowsPerPage}
						variant="outlined"
					/>

					<span style="margin-left: 40px;">
						{start + 1}-{end} of {guides.length}
					</span>
				</svelte:fragment>

				<IconButton
					class="material-icons"
					on:click={handleFirstPage}
					disabled={page === 0}
				>
					first_page
				</IconButton>
				<IconButton
					class="material-icons"
					on:click={handleSubtractPage}
					disabled={page === 0}
				>
					chevron_left
				</IconButton>
				<IconButton
					class="material-icons"
					on:click={handleAddPage}
					disabled={page === lastPage}
				>
					chevron_right
				</IconButton>
				<IconButton
					class="material-icons"
					on:click={handleLastPage}
					disabled={page === lastPage}
				>
					last_page
				</IconButton>
			</Pagination>
		{/if}
		<DataTable style="height: auto; max-height: 400px; overflow: auto;">
			<LinearLoading
				loading={$loading || $loadingStatus || $loadingUserRoles}
				slot="progress"
				indeterminate
			/>

			<Head>
				<Row>
					<Cell>Fecha y Hora</Cell>
					<Cell>Guía</Cell>
					<Cell>Estado</Cell>
					<Cell>Remitente</Cell>
					<Cell>Dir Remitente</Cell>
					<Cell>Tel Remitente</Cell>
					<Cell>Origen</Cell>
					<Cell>Destinatario</Cell>
					<Cell>Dir Destino</Cell>
					<Cell>Tel Destino</Cell>
					<Cell>Destino</Cell>
					<Cell>Servicio</Cell>
					<Cell>Unidades</Cell>
					<Cell>Total $</Cell>
				</Row>
			</Head>

			<Body>
				{#each guides as item (item.id)}
					<Row style="cursor: pointer;" on:click={() => handleSelectGuide(item)}>
						<Cell>{formatDateView(item.createdAt)}</Cell>
						<Cell>{item.number}</Cell>
						<Cell>{item.status?.name}</Cell>
						{#if item.clientOrigin?.natural}
							<Cell>{item.clientOrigin?.firstName} {item.clientOrigin?.lastName}</Cell>
						{:else}
							<Cell>{item.clientOrigin?.businessName} {item.clientOrigin?.nit}</Cell>
						{/if}
						<Cell>{item.clientOrigin?.address}</Cell>
						<Cell>{item.clientOrigin?.numberMovil}</Cell>
						<Cell>{item.pointSaleOrigin?.municipality}</Cell>

						{#if item.clientDestination?.natural}
							<Cell
								>{item.clientDestination?.firstName}
								{item.clientDestination?.lastName}</Cell
							>
						{:else}
							<Cell
								>{item.clientDestination?.businessName}
								{item.clientDestination?.nit}</Cell
							>
						{/if}
						<Cell>{item.clientDestination?.address}</Cell>
						<Cell>{item.clientDestination?.numberMovil}</Cell>
						<Cell>{item.pointSaleDestination?.municipality}</Cell>
						<Cell>{item.service?.name}</Cell>
						<Cell>{addCommodityUnits(item.commodity)}</Cell>
						<Cell>${item.price}</Cell>
					</Row>
				{/each}
			</Body>
		</DataTable>
		{#if guides.length === 0}
			<P style="text-align: center;">Sin Resultados</P>
		{/if}
	</Card>
</section>

<SeparatorNotLine style="margin-bottom: 50px;" />

<!-- Create Guide -->

<svelte:head>
	<title>Guías</title>
</svelte:head>

<style>
	section {
		width: 80%;
		max-width: 900px;
		margin: 40px auto;
	}

	form {
		& .box_inputs {
			display: flex;
			justify-content: space-between;
		}
	}
</style>
