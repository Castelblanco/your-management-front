<script lang="ts">
	import ButtonFab from '$atoms/button_fab.svelte';
	import CircularLoading from '$atoms/circular_loading.svelte';
	import SeparatorNotLine from '$atoms/separator_not_line.svelte';
	import { profileStore } from '$stores/profile';
	import Paper, { Content, Title } from '@smui/paper';

	export let loading: boolean;
	export let fileList: FileList;
	export let inputFile: HTMLInputElement;

	const handleClickEdit = () => inputFile.click();
</script>

{#if $profileStore}
	<Paper variant="unelevated">
		<div class="box_picture">
			<div class="picture_tray">
				{#if $profileStore.picture}
					<img src={$profileStore.picture.url} alt="foto" />
				{:else}
					<img src="/user-default.png" alt="foto" />
				{/if}
				{#if loading}
					<div class="change_picture_loading">
						<CircularLoading style="width: 40px; height: 40px;" indeterminate />
					</div>
				{/if}

				{#if !loading}
					<ButtonFab
						on:click={handleClickEdit}
						mini
						icon="edit"
						style="position: fixed; top: 100px; left: 130px;"
					/>
				{/if}
			</div>
		</div>
		<SeparatorNotLine />
		<Title>{$profileStore.firstName} {$profileStore.lastName}</Title>
		<Content>
			{$profileStore.pointSale?.name}
		</Content>

		<input
			bind:files={fileList}
			bind:this={inputFile}
			style="display: none;"
			type="file"
			name="picture"
			id="picture_id"
			accept="image/*"
		/>
	</Paper>
{/if}

<style>
	.box_picture {
		display: flex;
		justify-content: center;
		align-items: center;

		& .picture_tray {
			width: 120px;
			height: 120px;
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
				width: 120px;
				height: 120px;
				border-radius: 50%;
			}
		}
	}
</style>
