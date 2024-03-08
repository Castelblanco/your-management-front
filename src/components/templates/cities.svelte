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
	import { createOneCity, getAllCities, updateOneCity } from '$services/cities';
	import { citiesAdapters } from '$models/cities/adapters';
	import type { TCityDOM, TCityDepartmentDOM } from '$models/cities/entities';
	import type { TDepartmentDOM } from '$models/departments/entities';
	import Autocomplete from '$atoms/autocomplete.svelte';
	import { getAllDepartments } from '$services/departments';
	import { departmentsAdapters } from '$models/departments/adapters';

	const { callEndpointList, loading, callEndpointApi, cancelEndpoint } = callServices();
	const {
		callEndpointList: callEndpointListStatus,
		loading: loadingStatus,
		cancelEndpoint: cancelEndpointStatus
	} = callServices();
	const {
		callEndpointList: callEndpointListDepartaments,
		cancelEndpoint: cancelEndpointDepartaments
	} = callServices();

	onDestroy(() => {
		cancelEndpoint();
		cancelEndpointStatus();
		cancelEndpointDepartaments();
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
	let departaments: TCityDepartmentDOM[] = [];
	let filterName: string | undefined = undefined;
	let filterStatus: string | undefined = undefined;
	let filterDepartament: TCityDepartmentDOM | undefined = undefined;
	let cities: TCityDOM[] = [];
	let citiesStatusCode: TSelectOption[] = [];
	let openNewCity = false;
	const newCity: TCityDOM = {
		id: '',
		name: '',
		status: {
			id: '',
			name: ''
		},
		department: undefined
	};
	let cityEdit: TCityDOM = {
		id: '',
		name: '',
		status: {
			id: '',
			name: ''
		}
	};
	let cityEditClone: TCityDOM = {
		id: '',
		name: '',
		status: {
			id: '',
			name: ''
		}
	};
	let showEdit = false;
	$: disableUpdate = validObjects(cityEdit, cityEditClone);

	// Pagination
	let rowsPerPage = 10;
	let page = 0;
	$: start = page * rowsPerPage;
	$: end = Math.min(start + rowsPerPage, cities.length);
	$: lastPage = Math.max(Math.ceil(cities.length / rowsPerPage) - 1, 0);
	$: if (page > lastPage) page = lastPage;

	const getStatusCode = async () => {
		try {
			const status = await callEndpointListStatus(
				getAllStatusCode('cities'),
				statusCodeAdapters
			);
			citiesStatusCode = status.map(({ name, id }) => ({ label: name, value: id }));
		} catch (e) {
			console.log({ e });
		}
	};

	const handleSearchDepartament = async (
		name: string
	): Promise<false | TCityDepartmentDOM[]> => {
		try {
			if (name === '') return [];
			const departamentsFind = await callEndpointListDepartaments(
				getAllDepartments({
					name
				}),
				departmentsAdapters
			);

			return departamentsFind.map(({ id, name }) => ({
				id,
				name
			}));
		} catch (e) {
			console.log({ e });
			return false;
		}
	};

	const handleSearchCities = async (
		statusId?: string,
		departmentId?: TCityDepartmentDOM
	) => {
		try {
			cities = await callEndpointList(
				getAllCities({
					name: filterName,
					statusId,
					departmentId: departmentId?.id
				}),
				citiesAdapters
			);
		} catch (e) {
			console.log({ e });
		}
	};

	const handleCreateCity = async () => {
		try {
			const status = citiesStatusCode.find(({ label }) => label === STATUS_CODE.ACTIVE);
			if (!status) return;
			newCity.status = {
				id: `${status.value}`,
				name: ''
			};

			const city = await callEndpointApi(createOneCity(newCity), citiesAdapters);

			if (cities.length >= rowsPerPage) cities.pop();
			cities = [city, ...cities];
		} catch (e) {
			console.log({ e });
		}
	};

	const handleUpdateCity = async () => {
		try {
			const updateCity = await callEndpointApi(updateOneCity(cityEdit), citiesAdapters);
			const index = cities.findIndex(({ id }) => id === updateCity.id);
			cities.splice(index, 1, updateCity);
			cities = cities;
		} catch (e) {
			console.log({ e });
		}
	};

	const handleSelectCity = (city: TCityDOM) => {
		cityEditClone = JSON.parse(JSON.stringify(city));
		cityEdit = JSON.parse(JSON.stringify(city));
		showEdit = true;
	};

	const handleAddPage = () => page++;
	const handleSubtractPage = () => page--;
	const handleFirstPage = () => (page = 0);
	const handleLastPage = () => (page = lastPage);
	const toggleOpenNewCity = () => (openNewCity = !openNewCity);

	const formatAutocompleteDepartaments = (departament: TDepartmentDOM) => {
		if (departament) return departament.name;
		else return '';
	};

	getStatusCode();
	$: handleSearchCities(filterStatus, filterDepartament);
</script>

<ButtonFab on:click={toggleOpenNewCity} style="bottom: 30px; right: 30px;" icon="add" />
<section>
	<Card padded>
		<div class="container_form">
			<form on:submit={() => handleSearchCities(filterStatus, filterDepartament)}>
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

			<Autocomplete
				bind:value={filterDepartament}
				getOptionLabel={formatAutocompleteDepartaments}
				onSearch={handleSearchDepartament}
				showMenuWithNoInput
				variant="outlined"
				style="width: 25%;"
				label="Departamento"
			/>
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
					<Cell>Departamento</Cell>
				</Row>
			</Head>

			<Body>
				{#each cities as item (item.id)}
					<Row style="cursor: pointer;" on:click={() => handleSelectCity(item)}>
						<Cell>{item.name}</Cell>
						<Cell>{item.status?.name}</Cell>
						<Cell>{item.department?.name}</Cell>
					</Row>
				{/each}
			</Body>
		</DataTable>
		{#if cities.length === 0}
			<P style="text-align: center;">Sin Resultados</P>
		{/if}
	</Card>
</section>

<!-- Create City -->
<Dialog bind:open={openNewCity} scrimClickAction="">
	<Header>
		<Title>Crear Ciudad</Title>
	</Header>
	<SeparatorNotLine style="margin-top: 10px;" />
	<Content
		style="
			display: flex;
			flex-direction: column;
			align-items: center;
			height: fit-content;
            overflow: visible;
        "
	>
		<Textfield
			style="width: 100%;"
			label="Nombre"
			variant="outlined"
			bind:value={newCity.name}
		/>
		<SeparatorNotLine style="margin: 10px 0;" />
		<Autocomplete
			bind:value={newCity.department}
			getOptionLabel={formatAutocompleteDepartaments}
			onSearch={handleSearchDepartament}
			showMenuWithNoInput
			variant="outlined"
			style="width: 100%;"
			textfieldStyle="width: 100%;"
			label="Departamento"
		/>
	</Content>
	<Actions>
		<Button on:click={handleCreateCity} color="secondary">Crear</Button>
		<Button color="secondary">Cancelar</Button>
	</Actions>
</Dialog>

<!-- Select City and Edit -->
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
			bind:value={cityEdit.name}
		/>
		<SeparatorNotLine style="margin-top: 20px;" />

		{#if cityEdit.status}
			<SelectNoHelpertext
				options={citiesStatusCode}
				variant="outlined"
				label="Estado"
				style="width: 100%; overflow: visible;"
				disabled={$loading}
				bind:value={cityEdit.status.id}
			/>
		{/if}
		<SeparatorNotLine style="margin-top: 20px;" />

		<Autocomplete
			bind:value={cityEdit.department}
			getOptionLabel={formatAutocompleteDepartaments}
			onSearch={handleSearchDepartament}
			showMenuWithNoInput
			variant="outlined"
			style="width: 100%;"
			textfieldStyle="width: 100%;"
			label="Departamento"
		/>
	</Content>
	<Actions>
		<Button disabled={disableUpdate} on:click={handleUpdateCity} color="secondary">
			Actualizar
		</Button>
	</Actions>
</Dialog>

<svelte:head>
	<title>Ciudades y Departamentos</title>
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
