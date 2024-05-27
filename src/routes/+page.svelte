<script lang="ts">
	import Card from '@smui/card';
	import DataTable, { Body, Cell, Head, Row } from '@smui/data-table';

	let lngLat = { lat: 4.694351603367982, lon: -74.11896844417934 };

	const logClick = () => {
		console.log(lngLat);
	};
</script>

<section>
	<Card padded>
		<DataTable table$aria-label="User list">
			<Head>
				<Row>
					<Cell>Nombre</Cell>
					<Cell>Apellido</Cell>
					<Cell>Documento</Cell>
					<Cell>Correo</Cell>
					<Cell>Rol</Cell>
					<Cell>Estado</Cell>
					<Cell>Nombre</Cell>
					<Cell>Apellido</Cell>
					<Cell>Documento</Cell>
					<Cell>Correo</Cell>
					<Cell>Rol</Cell>
					<Cell>Estado</Cell>
				</Row>
			</Head>
			<Body>
				<Row>
					<Cell>Nombre</Cell>
					<Cell>Apellido</Cell>
					<Cell>Documento</Cell>
					<Cell>Correo</Cell>
					<Cell>Rol</Cell>
					<Cell>Estado</Cell>
					<Cell>Nombre</Cell>
					<Cell>Apellido</Cell>
					<Cell>Documento</Cell>
					<Cell>Correo</Cell>
					<Cell>Rol</Cell>
					<Cell>Estado</Cell>
				</Row>
				<Row>
					<Cell>Nombre</Cell>
					<Cell>Apellido</Cell>
					<Cell>Documento</Cell>
					<Cell>Correo</Cell>
					<Cell>Rol</Cell>
					<Cell>Estado</Cell>
					<Cell>Nombre</Cell>
					<Cell>Apellido</Cell>
					<Cell>Documento</Cell>
					<Cell>Correo</Cell>
					<Cell>Rol</Cell>
					<Cell>Estado</Cell>
				</Row>
			</Body>
		</DataTable>
	</Card>
</section>

<svelte:head>
	<title>Tu Gestion</title>
</svelte:head>

<style>
	section {
		width: fit-content;
		margin: 40px auto;
	}
</style>
