<script lang="ts">
	import Dialog, { Header, Title, Content, Actions } from '@smui/dialog';
	import Card from '@smui/card';
	import DataTable, { Body, Cell, Head, Label, Pagination, Row } from '@smui/data-table';
	import IconButton from '@smui/icon-button';
	import LinearLoading from '$atoms/linear_loading.svelte';
	import { callServices } from '$directives/call_services';
	import { onDestroy } from 'svelte';
	import P from '$atoms/p.svelte';
	import { statusCodeAdapters } from '$models/status_code/adapters';
	import TextfieldWithIcon from '$atoms/textfield_wih_icon.svelte';
	import Textfield from '$atoms/textfield.svelte';
	import type { TSelectOption } from '$molecules/types/select';
	import SelectNoHelpertext from '$molecules/select_no_helpertext.svelte';
	import { getAllStatusCode } from '$services/status_code';
	import ButtonFab from '$atoms/button_fab.svelte';
	import Button from '$atoms/button.svelte';
	import SeparatorNotLine from '$atoms/separator_not_line.svelte';
	import { STATUS_CODE } from '$constants/index';
	import { validObjects } from '$helpers/index';
	import {
		createOnePointSale,
		getAllPointsSale,
		updateOnePointSale
	} from '$services/points_sale';
	import { pointsSaleAdapters } from '$models/points_sale/adapters';
	import type { TPointSaleDOM } from '$models/points_sale/entities';
	import Map from '$templates/map.svelte';

	const { callEndpointList, loading, callEndpointApi, cancelEndpoint } = callServices();
	const {
		callEndpointList: callEndpointListStatus,
		loading: loadingStatus,
		cancelEndpoint: cancelEndpointStatus
	} = callServices();
	const {
		callEndpointList: callEndpointListCities,
		cancelEndpoint: cancelEndpointCities
	} = callServices();

	onDestroy(() => {
		cancelEndpoint();
		cancelEndpointStatus();
		cancelEndpointCities();
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
	let filterName: string | undefined = undefined;
	let filterStatus: string | undefined = undefined;
	let filterCity: string | undefined = undefined;
	let points: TPointSaleDOM[] = [];
	let citiesStatusCode: TSelectOption[] = [];
	let openNewCity = false;
	const newPoint: TPointSaleDOM = {
		id: '',
		name: '',
		address: '',
		budget: 0,
		statusId: '',
		cityId: '',
		city: '',
		status: '',
		latitude: 0,
		longitude: 0,
		users: undefined
	};
	let pointEdit: TPointSaleDOM = {
		id: '',
		name: '',
		address: '',
		budget: 0,
		statusId: '',
		cityId: '',
		city: '',
		status: '',
		latitude: 0,
		longitude: 0,
		users: undefined
	};
	let pointEditClone: TPointSaleDOM = {
		id: '',
		name: '',
		address: '',
		budget: 0,
		statusId: '',
		cityId: '',
		city: '',
		status: '',
		latitude: 0,
		longitude: 0,
		users: undefined
	};
	let showEdit = false;
	$: disableUpdate = validObjects(pointEdit, pointEditClone);

	// Pagination
	let rowsPerPage = 10;
	let page = 0;
	$: start = page * rowsPerPage;
	$: end = Math.min(start + rowsPerPage, points.length);
	$: lastPage = Math.max(Math.ceil(points.length / rowsPerPage) - 1, 0);
	$: if (page > lastPage) page = lastPage;

	const getStatusCode = async () => {
		try {
			const status = await callEndpointListStatus(
				getAllStatusCode('points_sale'),
				statusCodeAdapters
			);
			citiesStatusCode = status.map(({ name, id }) => ({ label: name, value: id }));
		} catch (e) {
			console.log({ e });
		}
	};

	const handleSearchPoint = async (statusId?: string, cityId?: string) => {
		try {
			points = await callEndpointList(
				getAllPointsSale({
					cityId,
					statusId
				}),
				pointsSaleAdapters
			);
		} catch (e) {
			console.log({ e });
		}
	};

	const handleCreateCity = async () => {
		try {
			const status = citiesStatusCode.find(({ label }) => label === STATUS_CODE.ACTIVE);
			if (!status) return;
			newPoint.statusId = `${status.value}`;

			const point = await callEndpointApi(
				createOnePointSale(newPoint),
				pointsSaleAdapters
			);

			if (points.length >= rowsPerPage) points.pop();
			points = [point, ...points];
		} catch (e) {
			console.log({ e });
		}
	};

	const handleUpdateCity = async () => {
		try {
			const updatePoint = await callEndpointApi(
				updateOnePointSale(pointEdit),
				pointsSaleAdapters
			);
			const index = points.findIndex(({ id }) => id === updatePoint.id);
			points.splice(index, 1, updatePoint);
			points = points;
		} catch (e) {
			console.log({ e });
		}
	};

	const handleSelectPoint = (point: TPointSaleDOM) => {
		pointEditClone = JSON.parse(JSON.stringify(point));
		pointEdit = JSON.parse(JSON.stringify(point));
		showEdit = true;
	};

	const handleAddPage = () => page++;
	const handleSubtractPage = () => page--;
	const handleFirstPage = () => (page = 0);
	const handleLastPage = () => (page = lastPage);
	const toggleOpenNewCity = () => (openNewCity = !openNewCity);

	const formatAutocompleteCities = (city: string) => {
		return city ? city : '';
	};

	getStatusCode();
	$: handleSearchPoint(filterStatus, filterCity);
</script>

<ButtonFab on:click={toggleOpenNewCity} style="bottom: 30px; right: 30px;" icon="add" />
<section>
	<Card padded>
		<div class="container_form">
			<form on:submit={() => handleSearchPoint(filterStatus, filterCity)}>
				<TextfieldWithIcon
					variant="outlined"
					label="Nombre"
					bind:value={filterName}
					iconLeft="search"
					style="width: 65%;"
					disabled={$loading}
				/>

				<SelectNoHelpertext
					options={citiesStatusCode}
					bind:value={filterStatus}
					variant="outlined"
					label="Estado"
					style="width: 30%;"
					disabled={$loading}
				/>
			</form>
		</div>
		<SeparatorNotLine style="margin: 20px 0;" />

		{#if citiesStatusCode.length > 0}
			<Pagination>
				<svelte:fragment slot="rowsPerPage">
					<Label>Filas por Pagina</Label>
					<SelectNoHelpertext
						options={pagesOptions}
						value={rowsPerPage}
						variant="outlined"
					/>

					<span style="margin-left: 40px;">
						{start + 1}-{end} of {citiesStatusCode.length}
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
		<DataTable
			stickyHeader
			style="height: auto; max-height: 400px; overflow: auto; position: relative;"
		>
			<LinearLoading
				closed={!$loading && !$loadingStatus}
				slot="progress"
				indeterminate
			/>

			<Head>
				<Row>
					<Cell>Nombre</Cell>
					<Cell>Estado</Cell>
					<Cell>Ciudad</Cell>
				</Row>
			</Head>

			<Body>
				{#each points as item (item.id)}
					<Row style="cursor: pointer;" on:click={() => handleSelectPoint(item)}>
						<Cell>{item.name}</Cell>
						<Cell>{item.status}</Cell>
						<Cell>{item.city}</Cell>
					</Row>
				{/each}
			</Body>
		</DataTable>
		{#if points.length === 0}
			<P style="text-align: center;">Sin Resultados</P>
		{/if}
	</Card>
</section>

<!-- Create Points Sale -->
<Dialog
	bind:open={openNewCity}
	scrimClickAction=""
	fullscreen
	aria-labelledby="large-scroll-title"
	aria-describedby="large-scroll-content"
	surface$style="width: 100%"
>
	<Header>
		<Title id="large-scroll-title">Crear Punto de Venta</Title>
	</Header>
	<SeparatorNotLine style="margin-top: 10px;" />
	<Content id="large-scroll-content">
		<Map />
	</Content>
	<Actions>
		<Button on:click={handleCreateCity} color="secondary">Crear</Button>
		<Button color="secondary">Cancelar</Button>
	</Actions>
</Dialog>

<!-- Select Points Sale and Edit -->
<Dialog bind:open={showEdit}>
	<Header>
		<Title>Detalle</Title>
	</Header>
	<SeparatorNotLine style="margin-top: 10px; " />
	<Content style="overflow: visible; height: fit-content;">
		<Textfield
			style="width: 100%;"
			label="Nombre"
			variant="outlined"
			bind:value={pointEdit.name}
		/>
		<SeparatorNotLine style="margin-top: 20px;" />

		{#if pointEdit.status}
			<SelectNoHelpertext
				options={citiesStatusCode}
				variant="outlined"
				label="Estado"
				style="width: 100%; overflow: visible;"
				disabled={$loading}
				bind:value={pointEdit.statusId}
			/>
		{/if}
	</Content>
	<Actions>
		<Button disabled={disableUpdate} on:click={handleUpdateCity} color="secondary">
			Actualizar
		</Button>
	</Actions>
</Dialog>

<svelte:head>
	<title>Puntos de Venta</title>
</svelte:head>

<style>
	section {
		width: 80%;
		max-width: 830px;
		margin: 40px auto;
	}

	.container_form {
		display: flex;
		justify-content: space-between;
	}

	form {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 72%;
	}
</style>
