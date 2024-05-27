<script lang="ts">
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
	import SeparatorNotLine from '$atoms/separator_not_line.svelte';
	import { validObjects } from '$helpers/index';
	import type { TUserDOM, TUserFilterDOM } from '$models/users/entities';
	import { getAllUsers } from '$services/users';
	import { getAllUserRoles } from '$services/user_roles';
	import { userAdapters } from '$models/users/adapters';
	import { userRolesAdapters } from '$models/user_roles/adapters';
	import ModalFormUser from '$templates/modals/form_user.svelte';

	const { callEndpointList, loading, cancelEndpoint } = callServices();
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
	let filterStatus: string | undefined = undefined;
	let filterRole: string | undefined = undefined;
	let users: TUserDOM[] = [];
	let usersStatusCodeFilter: TSelectOption[] = [];
	let usersStatusCode: TSelectOption[] = [];
	let usersRolesFilter: TSelectOption[] = [];
	let usersRoles: TSelectOption[] = [];
	let openModal = false;
	let isCreate = false;
	let userSelect: TUserDOM = {
		id: '',
		firstName: '',
		lastName: '',
		documentId: '',
		email: '',
		password: '',
		phone: '',
		address: '',
		role: {
			id: '',
			name: ''
		},
		pointSale: undefined,
		createdAt: new Date(),
		updatedAt: new Date()
	};
	let userEditClone: TUserDOM = {
		id: '',
		firstName: '',
		lastName: '',
		documentId: '',
		email: '',
		password: '',
		phone: '',
		address: '',
		role: {
			id: '',
			name: ''
		},
		pointSale: undefined,
		createdAt: new Date(),
		updatedAt: new Date()
	};
	$: disableUpdate = validObjects(userSelect, userEditClone);

	// Pagination
	let rowsPerPage = 10;
	let page = 0;
	$: start = page * rowsPerPage;
	$: end = Math.min(start + rowsPerPage, users.length);
	$: lastPage = Math.max(Math.ceil(users.length / rowsPerPage) - 1, 0);
	$: if (page > lastPage) page = lastPage;

	const getStatusCode = async () => {
		try {
			const status = await callEndpointListStatus(
				getAllStatusCode('users'),
				statusCodeAdapters
			);
			const statusMap = status.map(({ name, id }) => ({ label: name, value: id }));

			usersStatusCode = statusMap;
			usersStatusCodeFilter = [
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

	const getUserRoles = async () => {
		try {
			const roles = await callEndpointListUserRoles(getAllUserRoles(), userRolesAdapters);
			const statusMap = roles.map(({ name, id }) => ({ label: name, value: id }));

			usersRoles = statusMap;
			usersRolesFilter = [
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

	const handleSearchUser = async (statusId?: string, roleId?: string) => {
		try {
			users = await callEndpointList(
				getAllUsers({
					...filters,
					statusId,
					roleId,
					role: true,
					pointSale: true,
					limit: rowsPerPage,
					offset: page
				}),
				userAdapters
			);
		} catch (e) {
			console.log({ e });
		}
	};

	const handleSelectUser = (user: TUserDOM) => {
		userEditClone = JSON.parse(JSON.stringify(user));
		userSelect = JSON.parse(JSON.stringify(user));
		isCreate = false;
		toggleOpenModal();
	};

	const handleCreateUser = () => {
		isCreate = true;
		toggleOpenModal();
	};

	const handleAddPage = () => page++;
	const handleSubtractPage = () => page--;
	const handleFirstPage = () => (page = 0);
	const handleLastPage = () => (page = lastPage);
	const toggleOpenModal = () => (openModal = !openModal);

	getStatusCode();
	getUserRoles();
	$: handleSearchUser(filterStatus, filterRole);
</script>

<ButtonFab
	on:click={handleCreateUser}
	style="position: fixed; bottom: 30px; right: 30px;"
	icon="add"
/>
<section>
	<Card padded>
		<form on:submit|preventDefault={() => handleSearchUser(filterStatus, filterRole)}>
			<div class="box_inputs">
				<TextfieldWithIcon
					bind:value={filters.firstName}
					variant="outlined"
					label="Nombre"
					iconLeft="search"
					style="width: 32%;"
					disabled={$loading}
					name="firstname"
				/>
				<TextfieldWithIcon
					bind:value={filters.lastName}
					variant="outlined"
					label="Apellido"
					iconLeft="search"
					style="width: 32%;"
					disabled={$loading}
					name="lastname"
				/>
				<TextfieldWithIcon
					bind:value={filters.email}
					variant="outlined"
					label="Correo"
					iconLeft="search"
					style="width: 32%;"
					disabled={$loading}
					name="email"
				/>
			</div>
			<SeparatorNotLine style="margin-top: 10px;" />
			<div class="box_inputs">
				<TextfieldWithIcon
					bind:value={filters.documentId}
					variant="outlined"
					label="Documento"
					iconLeft="search"
					style="width: 32%;"
					disabled={$loading}
					name="document"
				/>
				<SelectNoHelpertext
					bind:value={filterRole}
					options={usersRolesFilter}
					variant="outlined"
					label="Rol"
					style="width: 32%;"
					disabled={$loading}
				/>
				<SelectNoHelpertext
					bind:value={filterStatus}
					options={usersStatusCodeFilter}
					variant="outlined"
					label="Estado"
					style="width: 32%;"
					disabled={$loading}
				/>
			</div>

			<button type="submit" style="display: none;"></button>
		</form>

		<SeparatorNotLine style="margin: 20px 0;" />

		{#if usersStatusCode.length > 0}
			<Pagination>
				<svelte:fragment slot="rowsPerPage">
					<Label>Filas por Pagina</Label>
					<SelectNoHelpertext
						options={pagesOptions}
						value={rowsPerPage}
						variant="outlined"
					/>

					<span style="margin-left: 40px;">
						{start + 1}-{end} of {users.length}
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
					<Cell>Nombre</Cell>
					<Cell>Apellido</Cell>
					<Cell>Documento</Cell>
					<Cell>Correo</Cell>
					<Cell>Rol</Cell>
					<Cell>Estado</Cell>
				</Row>
			</Head>

			<Body>
				{#each users as item (item.id)}
					<Row style="cursor: pointer;" on:click={() => handleSelectUser(item)}>
						<Cell>{item.firstName}</Cell>
						<Cell>{item.lastName}</Cell>
						<Cell>{item.documentId}</Cell>
						<Cell>{item.email}</Cell>
						<Cell>{item.role?.name}</Cell>
						<Cell>{item.status?.name}</Cell>
					</Row>
				{/each}
			</Body>
		</DataTable>
		{#if users.length === 0}
			<P style="text-align: center;">Sin Resultados</P>
		{/if}
	</Card>
</section>

<SeparatorNotLine style="margin-bottom: 50px;" />

<!-- Create Client -->
{#key openModal}
	<ModalFormUser
		bind:userSelect
		bind:show={openModal}
		userRoles={usersRoles}
		userStatusCode={usersStatusCode}
		{disableUpdate}
		{rowsPerPage}
		{isCreate}
		{users}
	/>
{/key}

<svelte:head>
	<title>Usuarios</title>
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
			justify-content: space-evenly;
		}
	}
</style>
