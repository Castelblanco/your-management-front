<script lang="ts">
	import SeparatorNotLine from '$atoms/separator_not_line.svelte';
	import type { TSelectOption } from '$molecules/types/select';
	import { callServices } from '$directives/call_services';
	import { type TUserDOM, type TUserPictureDOM } from '$models/users/entities';
	import { onDestroy } from 'svelte';
	import Dialog, { Actions, Content, Header, Title } from '@smui/dialog';
	import Button from '$atoms/button.svelte';
	import FormUser from '$organisms/form_user.svelte';
	import { createOneUser, updateOneUser } from '$services/users';
	import { userAdapters } from '$models/users/adapters';
	import { STATUS_CODE } from '$constants/status_code';

	export let users: TUserDOM[];
	export let userSelect: TUserDOM;
	export let userStatusCode: TSelectOption[];
	export let userRoles: TSelectOption[];
	export let isCreate = false;
	export let show: boolean;
	export let disableUpdate: boolean;
	export let rowsPerPage: number;

	const { callEndpointApi } = callServices();

	onDestroy(() => {
		if (isCreate) userSelect.pointSale = undefined;
	});

	let confirmPassword = '';
	const userPicture: TUserPictureDOM = {
		id: '',
		url: ''
	};

	const handleCreateUser = async () => {
		try {
			const status = userStatusCode.find(({ label }) => label === STATUS_CODE.ACTIVE);

			if (!status) return;
			userSelect = {
				...userSelect,
				status: {
					name: '',
					id: `${status.value}`
				}
			};

			if (userSelect.password !== confirmPassword) return;

			const user = await callEndpointApi(createOneUser(userSelect), userAdapters);
			user.status = {
				id: `${status.value}`,
				name: status.label
			};
			if (users.length >= rowsPerPage) users.pop();
			users = [user, ...users];
		} catch (e) {
			console.log({ e });
		}
	};

	const handleUpdateUser = async () => {
		try {
			const updateUser = await callEndpointApi(updateOneUser(userSelect), userAdapters);
			const index = users.findIndex(({ id }) => id === updateUser.id);
			users.splice(index, 1, updateUser);
			users = users;
		} catch (e) {
			console.log({ e });
		}
	};
</script>

<Dialog
	bind:open={show}
	fullscreen
	style="z-index: 100000000;"
	surface$style="width: 100vw; max-width: 1200px"
>
	<Header>
		<Title>
			{#if isCreate}
				Crear Usuario
			{:else}
				Detalle
			{/if}
		</Title>
	</Header>
	<SeparatorNotLine style="margin-top: 5px;" />
	<Content>
		<FormUser
			bind:confirmPassword
			bind:userSelect
			{userRoles}
			{userStatusCode}
			{isCreate}
		/>
	</Content>
	<Actions>
		{#if isCreate}
			<Button on:click={handleCreateUser} color="secondary">Crear</Button>
			<Button color="secondary">Cancelar</Button>
		{:else}
			<Button disabled={disableUpdate} on:click={handleUpdateUser} color="secondary">
				Actualizar
			</Button>
		{/if}
	</Actions>
</Dialog>
