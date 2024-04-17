<script lang="ts">
	import { Marker, type Map as IMap } from '@tomtom-international/web-sdk-maps';
	import Paper, { Title, Content } from '@smui/paper';
	import SeparatorNotLine from '$atoms/separator_not_line.svelte';
	import Map from '$organisms/map.svelte';
	import Textfield from '$atoms/textfield.svelte';
	import Icon from '$atoms/icon.svelte';
	import type { TSelectOption } from '$molecules/types/select';
	import SelectNoHelpertext from '$molecules/select_no_helpertext.svelte';
	import { callServices } from '$directives/call_services';
	import { getAllPointsSale } from '$services/points_sale';
	import { pointsSaleAdapters } from '$models/points_sale/adapters';
	import type { TUserDOM, TUserPointSaleDOM } from '$models/users/entities';
	import Autocomplete from '@smui-extra/autocomplete';
	import { onDestroy, onMount, tick } from 'svelte';
	import CircularLoading from '$atoms/circular_loading.svelte';

	const { callEndpointList, cancelEndpoint } = callServices();
	export let userSelect: TUserDOM;
	export let userStatusCode: TSelectOption[];
	export let userRoles: TSelectOption[];
	export let isCreate = false;
	export let confirmPassword = '';
	export let fileList: FileList | undefined;
	export let inputFile: HTMLInputElement | undefined = undefined;
	export let pictureLoading = false;

	onMount(async () => {
		await tick();
		mapCtl.resize();
	});

	onDestroy(() => {
		cancelEndpoint();
		if (isCreate) userSelect.pointSale = undefined;
	});

	let mapCtl: IMap;
	let markerList: Marker[] = [];
	let showChangePicture = false;

	const resetMakers = () => {
		markerList.forEach((marker) => marker.remove());
		markerList = [];
	};

	const searchPoint = async (query: string): Promise<false | TUserPointSaleDOM[]> => {
		try {
			if (query === '' || query === userSelect.pointSale?.name) return false;

			resetMakers();
			const points = await callEndpointList(
				getAllPointsSale({
					name: query
				}),
				pointsSaleAdapters
			);

			const userPoints: TUserPointSaleDOM[] = points.map((point) => {
				markerList.push(
					new Marker().setLngLat([point.longitude, point.latitude]).addTo(mapCtl)
				);
				return {
					id: point.id,
					name: point.name,
					address: point.address,
					budget: point.budget,
					department: point.department,
					municipality: point.municipality,
					neighborhood: point.neighborhood,
					latitude: point.latitude,
					longitude: point.longitude
				};
			});

			markerList = markerList;
			const bounds = mapCtl.getBounds();
			markerList.forEach((marker) => bounds.extend(marker.getLngLat()));
			mapCtl.fitBounds(bounds);
			mapCtl.setZoom(5);

			return userPoints;
		} catch (e) {
			return false;
		}
	};

	const toggleShowChangePicture = () => (showChangePicture = !showChangePicture);
	const handleFormatUbication = (option?: TUserPointSaleDOM): string =>
		!option ? '' : option.name;
</script>

<div class="container">
	<div>
		<Autocomplete
			bind:value={userSelect.pointSale}
			textfield$variant="outlined"
			label="Nombre del Punto de Venta"
			search={searchPoint}
			getOptionLabel={handleFormatUbication}
			style="min-width: 400px; width: 100%; margin-top: 10px;"
			textfield$style="min-width: 400px; width: 100%;"
		/>

		<SeparatorNotLine style="margin-top: 10px;" />

		{#if userSelect.pointSale}
			<Paper color="primary" style="max-width: 400px;">
				<Title>{userSelect.pointSale.address}</Title>
				<Content>
					Departamento: {userSelect.pointSale.department}
					<SeparatorNotLine />
					Municipio: {userSelect.pointSale.municipality}
					<SeparatorNotLine />
					Barrio: {userSelect.pointSale.neighborhood}
					<SeparatorNotLine />
					Latitud: {userSelect.pointSale.latitude}
					<SeparatorNotLine />
					Longitud: {userSelect.pointSale.longitude}
				</Content>
			</Paper>

			{#if !isCreate}
				<SeparatorNotLine style="margin-top: 20px;" />
				<div class="box_picture">
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<div
						class="picture_tray"
						on:mouseenter={toggleShowChangePicture}
						on:mouseleave={toggleShowChangePicture}
					>
						{#if userSelect.picture?.url}
							<img
								style="width: 200px; height: 200px;"
								src={userSelect.picture.url}
								alt="Foto de Perfil"
							/>
						{:else}
							<img
								style="width: 200px; height: 200px;"
								src="/user-default.png"
								alt="Foto de Perfil"
							/>
						{/if}
						{#if showChangePicture && !pictureLoading}
							<label for="picture_id">
								<div class="change_picture">
									<Icon icon="camera_alt" style="width: 24px; height: 24px;" />
									<p>Cambiar Foto de Perfil</p>
								</div>
							</label>
						{/if}
						{#if pictureLoading}
							<div class="change_picture_loading">
								<CircularLoading style="width: 40px; height: 40px;" indeterminate />
							</div>
						{/if}
					</div>
				</div>
				<input
					bind:files={fileList}
					bind:this={inputFile}
					style="display: none;"
					type="file"
					name="picture"
					id="picture_id"
					accept="image/*"
				/>
			{/if}

			<SeparatorNotLine style="margin-top: 20px;" />
			<div>
				<Textfield
					style="width: 49%;"
					label="Nombre"
					variant="outlined"
					required
					bind:value={userSelect.firstName}
				/>
				<Textfield
					style="width: 49%;"
					label="Apellido"
					variant="outlined"
					required
					bind:value={userSelect.lastName}
				/>
			</div>
			<SeparatorNotLine style="margin-top: 20px;" />
			<div>
				{#if userSelect.role}
					<SelectNoHelpertext
						bind:value={userSelect.role.id}
						options={userRoles}
						variant="outlined"
						label="Rol"
						style="width: {isCreate ? 100 : 49}%;"
						required
					/>
				{/if}
				{#if userSelect.status}
					<SelectNoHelpertext
						bind:value={userSelect.status.id}
						options={userStatusCode}
						variant="outlined"
						label="Estado"
						style="width: 49%;"
					/>
				{/if}
			</div>
			<SeparatorNotLine style="margin-top: 20px;" />
			<div>
				<Textfield
					style="width: 49%;"
					label="Correo"
					variant="outlined"
					required
					bind:value={userSelect.email}
				/>
				<Textfield
					style="width: 49%;"
					label="Documanto"
					variant="outlined"
					required
					bind:value={userSelect.documentId}
				/>
			</div>
			<SeparatorNotLine style="margin-top: 20px;" />
			<div>
				<Textfield
					style="width: 49%;"
					label="Telefono"
					variant="outlined"
					required
					bind:value={userSelect.phone}
				/>
				<Textfield
					style="width: 49%;"
					label="Dirección"
					variant="outlined"
					required
					bind:value={userSelect.address}
				/>
			</div>
			{#if isCreate}
				<SeparatorNotLine style="margin-top: 20px;" />
				<div>
					<Textfield
						style="width: 49%;"
						type="password"
						label="Contraseña"
						variant="outlined"
						required
						bind:value={userSelect.password}
					/>
					<Textfield
						style="width: 49%;"
						type="password"
						label="Confirmar Contraseña"
						variant="outlined"
						required
						bind:value={confirmPassword}
					/>
				</div>
			{/if}
		{/if}
	</div>

	<Map
		bind:mapCtl
		bind:markerList
		bind:ubicationSelect={userSelect.pointSale}
		width={600}
		height={600}
	/>
</div>

<style>
	.container {
		display: flex;

		& .box_picture {
			display: flex;
			justify-content: center;
			align-items: center;

			& .picture_tray {
				width: 200px;
				height: 200px;
				border-radius: 50%;
				position: relative;

				& .change_picture {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					width: 100%;
					position: absolute;
					top: 0;
					bottom: 0;
					border-radius: 50%;
					cursor: pointer;
					background-color: #1e2a31cc;

					& p {
						margin-top: 0;
					}
				}

				& .change_picture_loading {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					width: 100%;
					position: absolute;
					top: 0;
					bottom: 0;
					border-radius: 50%;
					background-color: #2226;
				}
				& img {
					border-radius: 50%;
				}
			}
		}
	}
</style>
