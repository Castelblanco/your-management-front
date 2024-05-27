<script lang="ts">
	import '@tomtom-international/web-sdk-maps/dist/maps.css';
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
	import { PUBLIC_TOMTOM_API_KEY } from '$env/static/public';
	import { onMount, tick } from 'svelte';
	import { streetDark, streetLight } from '$lib/index';
	import { appTheme } from '$stores/app_theme';
	import type { TUbicationMap } from './types';

	let container: HTMLElement;
	export let mapCtl: Map;
	export let ubicationSelect: TUbicationMap | undefined = undefined;
	export let markerList: Marker[] = [];
	export let width = 0;
	export let height = 0;

	$: if (
		ubicationSelect !== undefined &&
		ubicationSelect.latitude > 0 &&
		mapCtl !== undefined
	) {
		resetMakers();
		markerList.push(
			new Marker()
				.setLngLat([ubicationSelect.longitude, ubicationSelect.latitude])
				.addTo(mapCtl)
		);
		mapCtl.setCenter([ubicationSelect.longitude, ubicationSelect.latitude]);
		mapCtl.setZoom(15);
	}

	$: if (mapCtl) {
		mapCtl.setStyle($appTheme === 'dark' ? (streetDark as any) : streetLight);
	}

	onMount(async () => {
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
				...ubicationSelect,
				address: ubication.address?.freeformAddress!,
				department: ubication.address?.countrySubdivisionName!,
				municipality: ubication.address?.municipality!,
				neighborhood: ubication.address?.municipalitySubdivision,
				latitude: ubication.position?.lat!,
				longitude: ubication.position?.lng!
			};
		});

		await tick();
		mapCtl.resize();
	});

	const resetMakers = () => {
		markerList.forEach((marker) => marker.remove());
		markerList = [];
	};
</script>

<div
	style="width: {width}px; height: {height}px; margin-left: 10px;"
	bind:this={container}
></div>
