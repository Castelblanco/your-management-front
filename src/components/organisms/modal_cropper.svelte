<script lang="ts">
	import Button from '$atoms/button.svelte';
	import CropperJs from 'cropperjs';
	import Cropper from '$molecules/cropper.svelte';
	import Dialog, { Actions, Content, Header, Title } from '@smui/dialog';

	export let open = false;
	export let cropper: CropperJs;
	export let imageCrop: string | undefined;
	export let fileList: FileList | undefined;
	export let inputFile: HTMLInputElement;

	let image: string | undefined = '';

	$: if (fileList !== undefined) readerFile(fileList);

	const handleResizeImage = () => {
		imageCrop = cropper.getCroppedCanvas().toDataURL('image/png');
		image = undefined;
		inputFile.value = '';
	};

	const handleReset = () => {
		image = undefined;
		inputFile.value = '';
	};

	const readerFile = (fileList: FileList) => {
		const reader = new FileReader();
		reader.readAsDataURL(fileList[0]);
		reader.onload = ({ currentTarget }) => {
			if (!currentTarget) return;

			image = `${(currentTarget as FileReader).result}`;
			toggleOpen();
		};
	};

	const toggleOpen = () => (open = !open);
</script>

<Dialog bind:open fullscreen scrimClickAction="" surface$style="width: 100%;">
	<Header>
		<Title>Adaptando Foto</Title>
	</Header>
	<Content>
		{#if image}
			<Cropper bind:cropper src={image} />
		{/if}
	</Content>
	<Actions>
		<Button on:click={handleResizeImage} color="secondary">Guardar</Button>
		<Button on:click={handleReset} color="secondary">Cancelar</Button>
	</Actions>
</Dialog>
