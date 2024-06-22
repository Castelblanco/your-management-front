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
	import { addCommodityUnits, formatDateView } from '$helpers/index';
	import type { TUserDOM, TUserFilterDOM } from '$models/users/entities';
	import { getAllUsers } from '$services/users';
	import { getAllUserRoles } from '$services/user_roles';
	import { userAdapters } from '$models/users/adapters';
	import { userRolesAdapters } from '$models/user_roles/adapters';
	import { goto } from '$app/navigation';
	import {
		getAllGuidesService,
		getGuidesServiceNolveties,
		getGuidesServiceTypeServices
	} from '$services/guides_service';
	import { guidesServiceAdapters } from '$models/guides_service/adapters';
	import type { TGuideServiceDOM } from '$models/guides_service/entities';
	import { profileStore } from '$stores/profile';

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
	let filterNovelty: string | undefined = undefined;
	let filterServicesType: string | undefined = undefined;
	let guides: TGuideServiceDOM[] = [];
	let usersStatusCodeFilter: TSelectOption[] = [];
	let usersStatusCode: TSelectOption[] = [];
	let usersRolesFilter: TSelectOption[] = [];
	let usersRoles: TSelectOption[] = [];
	let noveltiesFilter: TSelectOption[] = [];
	let servicesTypeFilter: TSelectOption[] = [];
	let openModal = false;

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

	const handleSearchGuide = async (statusId?: string, roleId?: string) => {
		try {
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
					service: true
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

	getNoveltiesAndServicesType();
	getStatusCode();
	getUserRoles();
	$: handleSearchGuide(filterStatus, filterRole);
</script>

<ButtonFab
	on:click={handleCreateUser}
	style="position: fixed; bottom: 30px; right: 30px;"
	icon="add"
/>
<section>
	<Card padded>
		<form on:submit|preventDefault={() => handleSearchGuide(filterStatus, filterRole)}>
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
			<SeparatorNotLine style="margin-top: 10px;" />
			<div class="box_inputs">
				<SelectNoHelpertext
					bind:value={filterNovelty}
					options={noveltiesFilter}
					variant="outlined"
					label="Novedades"
					style="width: 32%;"
					disabled={$loading}
				/>
				<SelectNoHelpertext
					bind:value={filterServicesType}
					options={servicesTypeFilter}
					variant="outlined"
					label="Tipos de Servicio"
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
			justify-content: space-evenly;
		}
	}
</style>
