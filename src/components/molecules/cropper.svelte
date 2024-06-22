<script lang="ts">
	import 'cropperjs/dist/cropper.min.css';
	import Cropper from 'cropperjs';
	import { onMount } from 'svelte';

	export let cropper: Cropper;
	export let src: string;

	let image: HTMLImageElement;

	onMount(() => {
		image.addEventListener('load', () => {
			cropper = new Cropper(image, {
				aspectRatio: 1,
				viewMode: 0,
				guides: false,
				cropBoxResizable: false,
				movable: false,
				dragMode: 'move',
				highlight: false,
				data: {
					width: 282,
					height: 282,
					scaleX: 1,
					scaleY: 1
				},
				minCropBoxWidth: 1000000,
				minCropBoxHeight: 1000000,
				responsive: true
			});
		});
	});
</script>

<div>
	<img bind:this={image} {src} alt="" />
</div>

<style>
	div {
		max-width: 400px;
		& img {
			display: block;
			max-width: 100%;
			max-height: 100%;
		}
	}
</style>
