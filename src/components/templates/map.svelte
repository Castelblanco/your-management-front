<script lang="ts">
	import { map, Marker, type Map } from '@tomtom-international/web-sdk-maps';
	import { services } from '@tomtom-international/web-sdk-services';
	import '@tomtom-international/web-sdk-maps/dist/maps.css';
	import { PUBLIC_TOMTOM_API_KEY } from '$env/static/public';
	import { onMount } from 'svelte';
	import { streetDark } from '$lib/index';

	let container: HTMLElement;
	let mapCtl: Map;

	// const center = {
	// 	lat: 4.69454,
	// 	lng: -74.118402
	// };

	// const center: [number, number] = [-74.118402, 4.69454];

	const center: [number, number] = [-74.11891584086383, 4.694149337238631];

	onMount(() => {
		mapCtl = map({
			key: PUBLIC_TOMTOM_API_KEY,
			container,
			style: streetDark as any,
			center,
			zoom: 12
		});

		new Marker().setLngLat(center).addTo(mapCtl);
		new Marker().setLngLat([-74.1365383646386, 4.714790920225744]).addTo(mapCtl);
	});

	const getRoute = async () => {
		const res = await services.calculateRoute({
			key: PUBLIC_TOMTOM_API_KEY,
			locations: [
				[-74.11891584086383, 4.694149337238631],
				[-74.1365383646386, 4.714790920225744]
			]
		});

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
</script>

<div id="map" style="width: 500px; height: 500px;" bind:this={container}></div>
