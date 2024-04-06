<script lang="ts">
	import { Marker, type Map as IMap } from '@tomtom-international/web-sdk-maps';
	import { services } from '@tomtom-international/web-sdk-services';
	import { PUBLIC_TOMTOM_API_KEY } from '$env/static/public';
	import Autocomplete from '$atoms/autocomplete.svelte';
	import Paper, { Title, Content } from '@smui/paper';
	import SeparatorNotLine from '$atoms/separator_not_line.svelte';
	import Map from '$organisms/map.svelte';
	import type { TPointSaleDOM } from '$models/points_sale/entities';
	import Textfield from '$atoms/textfield.svelte';
	import type { TSelectOption } from '$molecules/types/select';
	import SelectNoHelpertext from '$molecules/select_no_helpertext.svelte';

	export let pointSaleSelect: TPointSaleDOM | undefined;
	export let pointSalesStatusCode: TSelectOption[];

	$: if (pointSaleSelect)
		pointSaleSelect = {
			...pointSaleSelect,
			name: pointSaleSelect.name || ''
		};

	let mapCtl: IMap;
	let markerList: Marker[] = [];

	const resetMakers = () => {
		markerList.forEach((marker) => marker.remove());
		markerList = [];
	};

	// const getRoute = async () => {
	// 	const res = await services.calculateRoute({
	// 		key: PUBLIC_TOMTOM_API_KEY,
	// 		locations: [
	// 			[-74.11891584086383, 4.694149337238631],
	// 			[-74.1365383646386, 4.714790920225744]
	// 		]
	// 	});

	// 	console.log({ res });

	// 	const geojson = res.toGeoJson();

	// 	mapCtl.addLayer({
	// 		id: crypto.randomUUID(),
	// 		type: 'line',
	// 		source: {
	// 			type: 'geojson',
	// 			data: geojson
	// 		},
	// 		layout: {
	// 			'line-cap': 'round',
	// 			'line-join': 'round'
	// 		},
	// 		paint: {
	// 			'line-color': '#ff0000',
	// 			'line-width': 2
	// 		}
	// 	});

	// 	mapCtl.setCenter([-74.1365383646386, 4.714790920225744]);
	// 	mapCtl.setZoom(12);
	// };

	const searchPoint = async (query: string): Promise<false | TPointSaleDOM[]> => {
		try {
			if (query === '' || query === pointSaleSelect?.address) return false;

			resetMakers();
			const { results } = await services.fuzzySearch({
				key: PUBLIC_TOMTOM_API_KEY,
				query,
				countrySet: 'CO'
			});

			if (!results) return false;

			const ubications: TPointSaleDOM[] = results.map((ubication) => {
				if (ubication.position) {
					const { lng, lat } = ubication.position;
					markerList.push(new Marker().setLngLat([lng!, lat!]).addTo(mapCtl));
				}
				return {
					id: pointSaleSelect?.id || '',
					budget: pointSaleSelect?.budget || 0,
					name: pointSaleSelect?.name || '',
					address: ubication.address?.freeformAddress!,
					department: ubication.address?.countrySubdivisionName!,
					municipality: ubication.address?.municipality!,
					neighborhood: ubication.address?.municipalitySubdivision!,
					latitude: ubication.position!.lat!,
					longitude: ubication.position!.lng!
				};
			});

			markerList = markerList;
			const bounds = mapCtl.getBounds();
			markerList.forEach((marker) => bounds.extend(marker.getLngLat()));
			mapCtl.fitBounds(bounds);
			mapCtl.setZoom(5);

			return ubications;
		} catch (e) {
			return false;
		}
	};

	const handleFormatUbication = (option?: TPointSaleDOM): string =>
		!option ? '' : option.address;
</script>

<div class="container">
	<div>
		<Autocomplete
			bind:value={pointSaleSelect}
			variant="outlined"
			label="Dirección"
			onSearch={searchPoint}
			getOptionLabel={handleFormatUbication}
			style="min-width: 400px; width: 100%; margin-top: 10px;"
			textfieldStyle="min-width: 400px; width: 100%;"
		/>

		<SeparatorNotLine style="margin-top: 10px;" />

		{#if pointSaleSelect}
			<Paper color="primary" style="max-width: 400px;">
				<Title>{pointSaleSelect.address}</Title>
				<Content>
					Departamento: {pointSaleSelect.department}
					<SeparatorNotLine />
					Municipio: {pointSaleSelect.municipality}
					<SeparatorNotLine />
					Barrio: {pointSaleSelect.neighborhood}
					<SeparatorNotLine />
					Latitud: {pointSaleSelect.latitude}
					<SeparatorNotLine />
					Longitud: {pointSaleSelect.longitude}
				</Content>
			</Paper>

			<SeparatorNotLine style="margin-top: 10px;" />
			<Textfield
				style="width: 100%; margin-top: 10px;"
				label="Nombre"
				variant="outlined"
				required
				bind:value={pointSaleSelect.name}
			/>

			<SeparatorNotLine style="margin-top: 20px;" />
			<div class="box_budget_status">
				<Textfield
					label="Presupuesto"
					variant="outlined"
					required
					prefix="COP"
					type="number"
					style="width: 49%;"
					bind:value={pointSaleSelect.budget}
				/>
				{#if pointSaleSelect.status}
					<SelectNoHelpertext
						bind:value={pointSaleSelect.status.id}
						options={pointSalesStatusCode}
						variant="outlined"
						label="Estado"
						style="width: 49%;"
					/>
				{/if}
			</div>
		{/if}
	</div>

	<Map
		bind:mapCtl
		bind:markerList
		bind:ubicationSelect={pointSaleSelect}
		width={600}
		height={600}
	/>
</div>

<style>
	.container {
		display: flex;
	}
	.box_budget_status {
		display: flex;
		justify-content: space-between;
	}
</style>
