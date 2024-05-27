<script lang="ts">
	import SeparatorNotLine from '$atoms/separator_not_line.svelte';
	import type { TPointSaleDOM } from '$models/points_sale/entities';
	import Paper, { Content, Title } from '@smui/paper';

	export let point: TPointSaleDOM;
</script>

<Paper color="primary" style="max-width: 400px;">
	<Title>{point.address}</Title>
	<Content>
		Departamento: {point.department}
		<SeparatorNotLine />
		Municipio: {point.municipality}
		<SeparatorNotLine />
		Barrio: {point.neighborhood}
		<SeparatorNotLine />
		Latitud: {point.latitude}
		<SeparatorNotLine />
		Longitud: {point.longitude}
	</Content>
</Paper>
