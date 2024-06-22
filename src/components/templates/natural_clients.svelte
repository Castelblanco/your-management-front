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
	import Textfield from '$atoms/textfield.svelte';
	import TextfieldWithIcon from '$atoms/textfield_wih_icon.svelte';
	import type { TSelectOption } from '$molecules/types/select';
	import SelectNoHelpertext from '$molecules/select_no_helpertext.svelte';
	import { getAllStatusCode } from '$services/status_code';
	import ButtonFab from '$atoms/button_fab.svelte';
	import Button from '$atoms/button.svelte';
	import SeparatorNotLine from '$atoms/separator_not_line.svelte';
	import { STATUS_CODE } from '$constants/index';
	import { validObjects } from '$helpers/index';
	import type {
		TNaturalClientDOM,
		TNaturalClientFilterDOM
	} from '$models/clients/natural/entities';
	import {
		createOneNaturalClient,
		updateOneNaturalClient,
		getAllNaturalClients
	} from '$services/clients/natural';
	import { naturalClientsAdapters } from '$models/clients/natural/adapters';

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
	let filters: TNaturalClientFilterDOM = {
		firstName: '',
		lastName: '',
		address: '',
		status: true,
		limit: 10,
		offset: 0
	};
	let filterStatus: string | undefined = undefined;
	let clients: TNaturalClientDOM[] = [];
	let clientsStatusCode: TSelectOption[] = [];
	let openNewClient = false;
	let newClient: TNaturalClientDOM = {
		id: '',
		numberMovil: '',
		address: '',
		documentId: '',
		firstName: '',
		lastName: '',
		natural: true,
		status: undefined
	};
	let clientEdit: TNaturalClientDOM = {
		id: '',
		numberMovil: '',
		address: '',
		documentId: '',
		firstName: '',
		lastName: '',
		natural: true,
		status: undefined
	};
	let clientEditClone: TNaturalClientDOM = {
		id: '',
		numberMovil: '',
		address: '',
		documentId: '',
		firstName: '',
		lastName: '',
		natural: true,
		status: undefined
	};
	let showEdit = false;
	$: disableUpdate = validObjects(clientEdit, clientEditClone);

	// Pagination
	let rowsPerPage = 10;
	let page = 0;
	$: start = page * rowsPerPage;
	$: end = Math.min(start + rowsPerPage, clients.length);
	$: lastPage = Math.max(Math.ceil(clients.length / rowsPerPage) - 1, 0);
	$: if (page > lastPage) page = lastPage;

	const getStatusCode = async () => {
		try {
			const status = await callEndpointListStatus(
				getAllStatusCode('clients'),
				statusCodeAdapters
			);
			const statusMap = status.map(({ name, id }) => ({ label: name, value: id }));

			statusMap.splice(0, 0, {
				label: '',
				value: ''
			});
			clientsStatusCode = statusMap;
		} catch (e) {
			console.log({ e });
		}
	};

	const handleSearchClient = async (statusId?: string) => {
		try {
			clients = await callEndpointList(
				getAllNaturalClients({
					...filters,
					statusId,
					limit: rowsPerPage,
					offset: page
				}),
				naturalClientsAdapters
			);
		} catch (e) {
			console.log({ e });
		}
	};

	const handleCreateClient = async () => {
		try {
			const status = clientsStatusCode.find(({ label }) => label === STATUS_CODE.ACTIVE);

			if (!status) return;
			newClient = {
				...newClient,
				status: {
					name: '',
					id: `${status.value}`
				}
			};
			const client = await callEndpointApi(
				createOneNaturalClient(newClient),
				naturalClientsAdapters
			);

			if (clients.length >= rowsPerPage) clients.pop();
			clients = [client, ...clients];
		} catch (e) {
			console.log({ e });
		}
	};

	const handleUpdateClient = async () => {
		try {
			const updateClient = await callEndpointApi(
				updateOneNaturalClient(clientEdit),
				naturalClientsAdapters
			);
			const index = clients.findIndex(({ id }) => id === updateClient.id);
			clients.splice(index, 1, updateClient);
			clients = clients;
		} catch (e) {
			console.log({ e });
		}
	};

	const handleSelectClient = (client: TNaturalClientDOM) => {
		clientEditClone = JSON.parse(JSON.stringify(client));
		clientEdit = JSON.parse(JSON.stringify(client));
		showEdit = true;
	};

	const handleAddPage = () => page++;
	const handleSubtractPage = () => page--;
	const handleFirstPage = () => (page = 0);
	const handleLastPage = () => (page = lastPage);
	const toggleOpenNewClient = () => (openNewClient = !openNewClient);

	getStatusCode();
	$: handleSearchClient(filterStatus);
</script>

<ButtonFab
	on:click={toggleOpenNewClient}
	style="position: fixed; bottom: 30px; right: 30px;"
	icon="add"
/>
<section>
	<Card padded>
		<form on:submit|preventDefault={() => handleSearchClient(filterStatus)}>
			<TextfieldWithIcon
				bind:value={filters.firstName}
				variant="outlined"
				label="Nombre"
				iconLeft="search"
				style="width: 26%;"
				disabled={$loading}
				name="firstname"
			/>
			<TextfieldWithIcon
				bind:value={filters.lastName}
				variant="outlined"
				label="Apellido"
				iconLeft="search"
				style="width: 26%;"
				disabled={$loading}
				name="lastname"
			/>
			<TextfieldWithIcon
				bind:value={filters.address}
				variant="outlined"
				label="Dirección"
				iconLeft="search"
				style="width: 26%;"
				disabled={$loading}
				name="address"
			/>

			<SelectNoHelpertext
				bind:value={filterStatus}
				options={clientsStatusCode}
				variant="outlined"
				label="Estado"
				style="width: 20%;"
				disabled={$loading}
			/>

			<button type="submit" style="display: none;"></button>
		</form>

		<SeparatorNotLine style="margin: 20px 0;" />

		{#if clientsStatusCode.length > 0}
			<Pagination>
				<svelte:fragment slot="rowsPerPage">
					<Label>Filas por Pagina</Label>
					<SelectNoHelpertext
						options={pagesOptions}
						value={rowsPerPage}
						variant="outlined"
					/>

					<span style="margin-left: 40px;">
						{start + 1}-{end} of {clients.length}
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
			<LinearLoading loading={$loading || $loadingStatus} slot="progress" indeterminate />

			<Head>
				<Row>
					<Cell>Nombre</Cell>
					<Cell>Apellido</Cell>
					<Cell>Dirección</Cell>
					<Cell>Estado</Cell>
				</Row>
			</Head>

			<Body>
				{#each clients as item (item.id)}
					<Row style="cursor: pointer;" on:click={() => handleSelectClient(item)}>
						<Cell>{item.firstName}</Cell>
						<Cell>{item.lastName}</Cell>
						<Cell>{item.address}</Cell>
						<Cell>{item.status?.name}</Cell>
					</Row>
				{/each}
			</Body>
		</DataTable>
		{#if clients.length === 0}
			<P style="text-align: center;">Sin Resultados</P>
		{/if}
	</Card>
</section>

<!-- Create Client -->
{#key openNewClient}
	<Dialog
		bind:open={openNewClient}
		scrimClickAction=""
		fullscreen
		surface$style="width: 100%"
	>
		<Header>
			<Title>Crear Cliente Natural</Title>
		</Header>
		<SeparatorNotLine style="margin-top: 5px;" />
		<Content>
			<div class="new_client_inputs">
				<Textfield
					bind:value={newClient.firstName}
					required
					style="width: 49%;"
					variant="outlined"
					label="Nombre"
				/>
				<Textfield
					bind:value={newClient.lastName}
					required
					style="width: 49%;"
					variant="outlined"
					label="Apellido"
				/>
			</div>
			<div class="new_client_inputs">
				<Textfield
					bind:value={newClient.numberMovil}
					required
					style="width: 49%;"
					variant="outlined"
					label="Telefono"
				/>
				<Textfield
					bind:value={newClient.documentId}
					required
					style="width: 49%;"
					variant="outlined"
					label="Documento"
				/>
			</div>
			<SeparatorNotLine style="margin-top: 20px;" />
			<Textfield
				bind:value={newClient.address}
				required
				style="width: 100%;"
				variant="outlined"
				label="Dirección"
			/>
		</Content>
		<Actions>
			<Button on:click={handleCreateClient} color="secondary">Crear</Button>
			<Button color="secondary">Cancelar</Button>
		</Actions>
	</Dialog>
{/key}

<!-- Select Client Sale and Edit -->
{#key showEdit}
	<Dialog bind:open={showEdit} fullscreen surface$style="width: 100%">
		<Header>
			<Title>Detalle</Title>
		</Header>
		<SeparatorNotLine style="margin-top: 5px;" />
		<Content>
			<div class="new_client_inputs">
				<Textfield
					bind:value={clientEdit.firstName}
					required
					style="width: 49%;"
					variant="outlined"
					label="Nombre"
				/>
				<Textfield
					bind:value={clientEdit.lastName}
					required
					style="width: 49%;"
					variant="outlined"
					label="Apellido"
				/>
			</div>
			<div class="new_client_inputs">
				<Textfield
					bind:value={clientEdit.numberMovil}
					required
					style="width: 49%;"
					variant="outlined"
					label="Telefono"
				/>
				{#if clientEdit.status}
					<SelectNoHelpertext
						options={clientsStatusCode}
						bind:value={clientEdit.status.id}
						variant="outlined"
						label="Estado"
						style="width: 49%;"
						disabled={$loading}
					/>
				{/if}
			</div>
			<div class="new_client_inputs">
				<Textfield
					bind:value={clientEdit.address}
					required
					style="width: 49%;"
					variant="outlined"
					label="Dirección"
				/>
				<Textfield
					bind:value={clientEdit.documentId}
					required
					style="width: 49%;"
					variant="outlined"
					label="Documento"
				/>
			</div>
		</Content>
		<Actions>
			<Button disabled={disableUpdate} on:click={handleUpdateClient} color="secondary">
				Actualizar
			</Button>
		</Actions>
	</Dialog>
{/key}

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

	.new_client_inputs {
		display: flex;
		justify-content: space-between;
		min-width: 400px;
		margin-top: 20px;
	}
</style>
