<script lang="ts">
	import {
		map,
		Marker,
		type Map,
		FullscreenControl,
		NavigationControl
	} from '@tomtom-international/web-sdk-maps';
	import {
		services,
		type FuzzySearchResult
	} from '@tomtom-international/web-sdk-services';
	import '@tomtom-international/web-sdk-maps/dist/maps.css';
	import { PUBLIC_TOMTOM_API_KEY } from '$env/static/public';
	import { onMount } from 'svelte';
	import { streetDark, streetLight } from '$lib/index';
	import { appTheme } from '$stores/app_theme';
	import Autocomplete from '$atoms/autocomplete.svelte';
	import Card from '@smui/card';
	import Paper, { Title, Content } from '@smui/paper';
	import SeparatorNotLine from '$atoms/separator_not_line.svelte';
	import Button from '$atoms/button.svelte';

	type TUbication = {
		id: string;
		address: string;
		department: string;
		municipality: string;
		neighborhood?: string;
		lat: number;
		lng: number;
	};

	let container: HTMLElement;
	let mapCtl: Map;
	let ubicationSelect: TUbication | undefined = undefined;
	let markerList: Marker[] = [];

	$: if (ubicationSelect) {
		resetMakers();
		markerList.push(
			new Marker().setLngLat([ubicationSelect.lng, ubicationSelect.lat]).addTo(mapCtl)
		);
		if (mapCtl) {
			mapCtl.setCenter([ubicationSelect.lng, ubicationSelect.lat]);
			mapCtl.setZoom(15);
		}
	}

	// const center = {
	// 	lat: 4.69454,
	// 	lng: -74.118402
	// };

	$: if (mapCtl) {
		mapCtl.setStyle($appTheme === 'dark' ? (streetDark as any) : streetLight);
	}

	onMount(() => {
		mapCtl = map({
			key: PUBLIC_TOMTOM_API_KEY,
			container,
			style: $appTheme === 'dark' ? (streetDark as any) : streetLight,
			center: [-72.9301367, 4.1156735], // Colombia Coordinates
			zoom: 4.5,
			doubleClickZoom: false,
			maxZoom: 20
		});

		mapCtl.addControl(new FullscreenControl());
		mapCtl.addControl(new NavigationControl());

		mapCtl.on('dblclick', async (e) => {
			resetMakers();
			const res = await services.reverseGeocode({
				key: PUBLIC_TOMTOM_API_KEY,
				position: e.lngLat
			});

			const [ubication]: FuzzySearchResult[] = res.addresses;
			markerList.push(new Marker().setLngLat([e.lngLat.lng, e.lngLat.lat]).addTo(mapCtl));

			ubicationSelect = {
				id: ubication.id!,
				address: ubication.address?.freeformAddress!,
				department: ubication.address?.countrySubdivisionName!,
				municipality: ubication.address?.municipality!,
				neighborhood: ubication.address?.municipalitySubdivision,
				lat: ubication.position?.lat!,
				lng: ubication.position?.lng!
			};
		});
	});

	const resetMakers = () => {
		markerList.forEach((marker) => marker.remove());
		markerList = [];
	};

	const getRoute = async () => {
		const res = await services.calculateRoute({
			key: PUBLIC_TOMTOM_API_KEY,
			locations: [
				[-74.11891584086383, 4.694149337238631],
				[-74.1365383646386, 4.714790920225744]
			]
		});

		console.log({ res });

		const geojson = res.toGeoJson();

		mapCtl.addLayer({
			id: crypto.randomUUID(),
			type: 'line',
			source: {
				type: 'geojson',
				data: geojson
			},
			layout: {
				'line-cap': 'round',
				'line-join': 'round'
			},
			paint: {
				'line-color': '#ff0000',
				'line-width': 2
			}
		});

		mapCtl.setCenter([-74.1365383646386, 4.714790920225744]);
		mapCtl.setZoom(12);
	};

	const handleSearchPoint = async (query: string): Promise<false | TUbication[]> => {
		try {
			if (query === '') return false;

			resetMakers();

			const { results } = await services.fuzzySearch({
				key: PUBLIC_TOMTOM_API_KEY,
				query,
				countrySet: 'CO'
			});

			if (!results) return false;

			const ubications: TUbication[] = results.map((ubication) => {
				if (ubication.position) {
					const { lng, lat } = ubication.position;
					markerList.push(
						new Marker().setLngLat([lng!, lat!]).setDraggable(true).addTo(mapCtl)
					);
				}
				return {
					id: ubication.id!,
					address: ubication.address?.freeformAddress!,
					department: ubication.address?.countrySubdivisionName!,
					municipality: ubication.address?.municipality!,
					neighborhood: ubication.address?.municipalitySubdivision,
					lat: ubication.position!.lat!,
					lng: ubication.position!.lng!
				};
			});

			markerList = markerList;
			const bounds = mapCtl.getBounds();

			markerList.forEach((marker) => {
				bounds.extend(marker.getLngLat());
			});
			mapCtl.fitBounds(bounds);
			mapCtl.setZoom(5);

			return ubications;
		} catch (e) {
			return false as false;
		}
	};

	const handleFormatUbication = (option?: TUbication): string => {
		return !option ? '' : option.address;
	};
</script>

<Card
	style="
		display: flex;
		flex-direction: row;
	"
	padded
>
	<div>
		<Autocomplete
			bind:value={ubicationSelect}
			variant="outlined"
			label="Buscar"
			onSearch={handleSearchPoint}
			getOptionLabel={handleFormatUbication}
			style="max-width: 400px; width: 40%;"
			textfieldStyle="width: 400px; display: block"
		/>

		<SeparatorNotLine style="margin-top: 20px;" />

		{#if ubicationSelect}
			<Paper color="primary" style="max-width: 400px;">
				<Title>{ubicationSelect.address}</Title>
				<Content>
					Departamento: {ubicationSelect.department}
					<SeparatorNotLine />
					Municipio: {ubicationSelect.municipality}
					<SeparatorNotLine />
					Barrio: {ubicationSelect.neighborhood}
					<SeparatorNotLine />
					Latitud: {ubicationSelect.lat}
					<SeparatorNotLine />
					Longitud: {ubicationSelect.lng}
				</Content>
			</Paper>
		{/if}
	</div>

	<div
		style="width: 600px; height: 600px; margin-left: 10px;"
		bind:this={container}
	></div>
</Card>
