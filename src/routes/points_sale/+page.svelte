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
	import FormPointsSale from '$templates/form_points_sale.svelte';

	const { callEndpointList, loading, callEndpointApi, cancelEndpoint } = callServices();
	const {
		callEndpointList: callEndpointListStatus,
		loading: loadingStatus,
		cancelEndpoint: cancelEndpointStatus
	} = callServices();

	onDestroy(() => {
		cancelEndpoint();
		cancelEndpointStatus();
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
	let points: TPointSaleDOM[] = [];
	let pointSalesStatusCodeFilter: TSelectOption[] = [];
	let pointSalesStatusCode: TSelectOption[] = [];
	let openNewPointSale = false;
	let newPoint: TPointSaleDOM | undefined = undefined;
	let pointEdit: TPointSaleDOM = {
		id: '',
		name: '',
		address: '',
		budget: 0,
		department: '',
		municipality: '',
		neighborhood: '',
		status: undefined,
		latitude: 0,
		longitude: 0,
		users: undefined
	};
	let pointEditClone: TPointSaleDOM = {
		id: '',
		name: '',
		address: '',
		budget: 0,
		department: '',
		municipality: '',
		neighborhood: '',
		status: undefined,
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
			const statusMap = status.map(({ name, id }) => ({ label: name, value: id }));

			pointSalesStatusCode = statusMap;
			pointSalesStatusCodeFilter = [
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

	const handleSearchPoint = async (statusId?: string) => {
		try {
			points = await callEndpointList(
				getAllPointsSale({
					statusId,
					name: filterName
				}),
				pointsSaleAdapters
			);
		} catch (e) {
			console.log({ e });
		}
	};

	const handleCreatePoint = async () => {
		try {
			const status = pointSalesStatusCode.find(
				({ label }) => label === STATUS_CODE.ACTIVE
			);

			if (!status || !newPoint) return;
			newPoint = {
				...newPoint,
				status: {
					name: '',
					id: `${status.value}`
				}
			};

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

	const handleUpdatePoint = async () => {
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
	const toggleOpenNewPoint = () => (openNewPointSale = !openNewPointSale);

	getStatusCode();
	$: handleSearchPoint(filterStatus);
</script>

<ButtonFab on:click={toggleOpenNewPoint} style="bottom: 30px; right: 30px;" icon="add" />
<section>
	<Card padded>
		<form on:submit={() => handleSearchPoint(filterStatus)}>
			<TextfieldWithIcon
				variant="outlined"
				label="Nombre"
				bind:value={filterName}
				iconLeft="search"
				style="width: 69%;"
				disabled={$loading}
			/>

			<SelectNoHelpertext
				options={pointSalesStatusCodeFilter}
				bind:value={filterStatus}
				variant="outlined"
				label="Estado"
				style="width: 30%;"
				disabled={$loading}
			/>
		</form>
		<SeparatorNotLine style="margin: 20px 0;" />

		{#if pointSalesStatusCode.length > 0}
			<Pagination>
				<svelte:fragment slot="rowsPerPage">
					<Label>Filas por Pagina</Label>
					<SelectNoHelpertext
						options={pagesOptions}
						value={rowsPerPage}
						variant="outlined"
					/>

					<span style="margin-left: 40px;">
						{start + 1}-{end} of {points.length}
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
			<LinearLoading loading={$loading || $loadingStatus} slot="progress" indeterminate />

			<Head>
				<Row>
					<Cell>Nombre</Cell>
					<Cell>Departamento</Cell>
					<Cell>Municipio</Cell>
					<Cell>Estado</Cell>
				</Row>
			</Head>

			<Body>
				{#each points as item (item.id)}
					<Row style="cursor: pointer;" on:click={() => handleSelectPoint(item)}>
						<Cell>{item.name}</Cell>
						<Cell>{item.department}</Cell>
						<Cell>{item.municipality}</Cell>
						<Cell>{item.status?.name}</Cell>
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
{#key openNewPointSale}
	<Dialog
		bind:open={openNewPointSale}
		scrimClickAction=""
		fullscreen
		surface$style="width: 100%"
	>
		<Header>
			<Title>Crear Punto de Venta</Title>
		</Header>
		<Content>
			<FormPointsSale bind:pointSaleSelect={newPoint} {pointSalesStatusCode} />
		</Content>
		<Actions>
			<Button on:click={handleCreatePoint} color="secondary">Crear</Button>
			<Button color="secondary">Cancelar</Button>
		</Actions>
	</Dialog>
{/key}

<!-- Select Points Sale and Edit -->
{#key showEdit}
	<Dialog bind:open={showEdit} fullscreen surface$style="width: 100%">
		<Header>
			<Title>Detalle</Title>
		</Header>
		<Content>
			<FormPointsSale bind:pointSaleSelect={pointEdit} {pointSalesStatusCode} />
		</Content>
		<Actions>
			<Button disabled={disableUpdate} on:click={handleUpdatePoint} color="secondary">
				Actualizar
			</Button>
		</Actions>
	</Dialog>
{/key}

<svelte:head>
	<title>Puntos de Venta</title>
</svelte:head>

<style>
	section {
		width: 80%;
		max-width: 830px;
		margin: 40px auto;
	}

	form {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
</style>
