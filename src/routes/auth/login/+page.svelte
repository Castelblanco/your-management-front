<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$atoms/button.svelte';
	import CircularLoading from '$atoms/circular_loading.svelte';
	import SeparatorNotLine from '$atoms/separator_not_line.svelte';
	import Textfield from '$atoms/textfield.svelte';
	import { callServices } from '$directives/call_services';
	import { usersLoginAdapters } from '$models/users/adapters';
	import type { TInitUserLoginDOM } from '$models/users/entities';
	import { userLogin } from '$services/users';
	import { profileStore } from '$stores/profile';
	import Paper, { Title, Content } from '@smui/paper';
	import { onDestroy } from 'svelte';

	const { loading, callEndpointApi, cancelEndpoint } = callServices();

	onDestroy(cancelEndpoint);

	const profileLogin: TInitUserLoginDOM = {
		email: '',
		password: ''
	};

	const handleLogin = async () => {
		try {
			const login = await callEndpointApi(userLogin(profileLogin), usersLoginAdapters);
			profileStore.change(login);

			goto('/profile');
		} catch (e) {
			console.log({ e });
		}
	};
</script>

<div class="container">
	<Paper style="height: 100%;">
		<Title style="text-align: center;">Iniciar Sesión</Title>
		<SeparatorNotLine style="margin-top: 20px;" />
		<Content>
			<form>
				<Textfield
					bind:value={profileLogin.email}
					style="width: 80%;"
					label="Correo Electrónico"
					type="email"
					name="email"
				/>
				<SeparatorNotLine style="margin-top: 20px;" />
				<Textfield
					bind:value={profileLogin.password}
					style="width: 80%;"
					label="Contraseña"
					type="password"
					name="password"
				/>
				<SeparatorNotLine style="margin-top: 40px;" />
				<Button on:click={handleLogin} color="secondary" style="width: 80%;">
					{#if $loading}
						<CircularLoading style="height: 30px; width: 30px;" indeterminate />
					{:else}
						Iniciar Sesión
					{/if}
				</Button>
			</form>
		</Content>
	</Paper>
</div>

<svelte:head>
	<title>Iniciar Sesión</title>
</svelte:head>

<style>
	.container {
		width: 60%;
		max-width: 830px;
		max-height: 60%;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	form {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
	}
</style>
