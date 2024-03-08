<script lang="ts">
	import Dialog, { Header, Title, Content, Actions } from '@smui/dialog';
	import Card from '@smui/card';
	import DataTable, { Body, Cell, Head, Label, Pagination, Row } from '@smui/data-table';
	import IconButton from '@smui/icon-button';
	import LinearLoading from '$atoms/linear_loading.svelte';
	import { Separator } from '@smui/list';
	import { callServices } from '$directives/call_services';
	import { onDestroy } from 'svelte';
	import P from '$atoms/p.svelte';
	import {
		createOneDepartment,
		getAllDepartments,
		updateOneDepartment
	} from '$services/departments';
	import { departmentsAdapters } from '$models/departments/adapters';
	import { statusCodeAdapters } from '$models/status_code/adapters';
	import type {
		DepartmentDOM,
		TDepartmentDOM,
		TDepartmentFilterDOM
	} from '$models/departments/entities';
	import TextfieldWithIcon from '$atoms/textfield_wih_icon.svelte';
	import Textfield from '$atoms/textfield.svelte';
	import type { TSelectOption } from '$molecules/types/select';
	import SelectNoHelpertext from '$molecules/select_no_helpertext.svelte';
	import { getAllStatusCode } from '$services/status_code';
	import ButtonFab from '$atoms/button_fab.svelte';
	import Button from '$atoms/button.svelte';
	import { STATUS_CODE } from '$constants/index';
	import { validObjects } from '$helpers/index';

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
	const filters: TDepartmentFilterDOM = {
		name: undefined
	};
	let filterStatusId: string | undefined = undefined;
	let departments: DepartmentDOM[] = [];
	let departmentStatusCode: TSelectOption[] = [];
	let openNewDepartment = false;
	const newDepartment: TDepartmentDOM = {
		id: '',
		name: '',
		status: {
			id: '',
			name: ''
		}
	};
	let departmentEdit: TDepartmentDOM = {
		id: '',
		name: '',
		status: {
			id: '',
			name: ''
		}
	};
	let departmentEditClone: TDepartmentDOM = {
		id: '',
		name: '',
		status: {
			id: '',
			name: ''
		}
	};
	let showEdit = false;
	$: disableUpdate = validObjects(departmentEdit, departmentEditClone);

	// Pagination
	let rowsPerPage = 10;
	let page = 0;
	$: start = page * rowsPerPage;
	$: end = Math.min(start + rowsPerPage, departments.length);
	$: lastPage = Math.max(Math.ceil(departments.length / rowsPerPage) - 1, 0);
	$: if (page > lastPage) page = lastPage;

	const getStatusCode = async () => {
		try {
			const status = await callEndpointListStatus(
				getAllStatusCode('department'),
				statusCodeAdapters
			);
			departmentStatusCode = status.map(({ name, id }) => ({ label: name, value: id }));
		} catch (e) {
			console.log({ e });
		}
	};

	const handleSearchDepartment = async (statusId?: string) => {
		try {
			departments = await callEndpointList(
				getAllDepartments({ ...filters, statusId }),
				departmentsAdapters
			);
		} catch (e) {
			console.log({ e });
		}
	};

	const handleCreateDepartment = async () => {
		try {
			const status = departmentStatusCode.find(
				({ label }) => label === STATUS_CODE.ACTIVE
			);
			if (!status) return;
			newDepartment.status = {
				id: `${status.value}`,
				name: ''
			};

			const department = await callEndpointApi(
				createOneDepartment(newDepartment),
				departmentsAdapters
			);

			if (departments.length >= rowsPerPage) departments.pop();
			departments = [department, ...departments];
		} catch (e) {
			console.log({ e });
		}
	};

	const handleUpdateDepartment = async () => {
		try {
			const updateDepartament = await callEndpointApi(
				updateOneDepartment(departmentEdit),
				departmentsAdapters
			);

			const index = departments.findIndex(({ id }) => id === updateDepartament.id);

			departments.splice(index, 1, updateDepartament);
			departments = departments;
		} catch (e) {
			console.log({ e });
		}
	};

	const handleSelectDeparment = (department: TDepartmentDOM) => {
		departmentEditClone = JSON.parse(JSON.stringify(department));
		departmentEdit = { ...department };
		showEdit = true;
	};

	const handleAddPage = () => page++;
	const handleSubtractPage = () => page--;
	const handleFirstPage = () => (page = 0);
	const handleLastPage = () => (page = lastPage);
	const toggleOpenNewDepartment = () => (openNewDepartment = !openNewDepartment);

	getStatusCode();

	$: handleSearchDepartment(filterStatusId);
</script>

<ButtonFab
	on:click={toggleOpenNewDepartment}
	style="bottom: 30px; right: 30px;"
	icon="add"
/>
<section>
	<Card padded>
		<form on:submit={() => handleSearchDepartment(filterStatusId)}>
			<TextfieldWithIcon
				variant="outlined"
				label="Nombre"
				bind:value={filters.name}
				iconLeft="search"
				style="width: 60%;"
				disabled={$loading}
			/>

			<SelectNoHelpertext
				options={departmentStatusCode}
				bind:value={filterStatusId}
				variant="outlined"
				label="Estado"
				disabled={$loading}
			/>
		</form>
		<Separator style="margin: 20px 0; border-width: 0;" />

		{#if departments.length > 0}
			<Pagination>
				<svelte:fragment slot="rowsPerPage">
					<Label>Filas por Pagina</Label>
					<SelectNoHelpertext
						options={pagesOptions}
						value={rowsPerPage}
						variant="outlined"
					/>

					<span style="margin-left: 40px;">
						{start + 1}-{end} of {departments.length}
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
				</Row>
			</Head>

			<Body>
				{#each departments as item (item.id)}
					<Row style="cursor: pointer;" on:click={() => handleSelectDeparment(item)}>
						<Cell>{item.name}</Cell>
						<Cell>{item.status?.name}</Cell>
					</Row>
				{/each}
			</Body>
		</DataTable>
		{#if departments.length === 0}
			<P style="text-align: center;">Sin Resultados</P>
		{/if}
	</Card>
</section>

<!-- Create Department -->
<Dialog bind:open={openNewDepartment} scrimClickAction="">
	<Header>
		<Title>Crear Departamento</Title>
	</Header>
	<Separator style="margin-top: 10px; border-width: 0;" />
	<Content
		style="
			display: flex;
			flex-direction: column;
			align-items: center;
			height: fit-content;"
	>
		<Textfield
			style="width: 100%;"
			label="Nombre"
			variant="outlined"
			bind:value={newDepartment.name}
		/>
	</Content>
	<Actions>
		<Button on:click={handleCreateDepartment} color="secondary">Crear</Button>
		<Button color="secondary">Cancelar</Button>
	</Actions>
</Dialog>

<!-- Select Department and Edit -->
<Dialog bind:open={showEdit}>
	<Header>
		<Title>Detalle</Title>
	</Header>
	<Separator style="margin-top: 10px; border-width: 0;" />
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
			bind:value={departmentEdit.name}
		/>
		<Separator style="margin-top: 20px; border-width: 0;" />

		{#if departmentEdit.status}
			<SelectNoHelpertext
				options={departmentStatusCode}
				variant="outlined"
				label="Estado"
				style="width: 100%;"
				disabled={$loading}
				bind:value={departmentEdit.status.id}
			/>
		{/if}
	</Content>
	<Actions>
		<Button disabled={disableUpdate} on:click={handleUpdateDepartment} color="secondary">
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
		max-width: 630px;
		margin: 40px auto;
	}

	form {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
</style>
