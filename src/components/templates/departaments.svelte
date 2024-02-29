<script lang="ts">
	import InputSearch from '$molecules/input_search.svelte';
	import Card from '@smui/card';
	import DataTable, { Body, Cell, Head, Row } from '@smui/data-table';
</script>

<section>
	<Card padded>
		<InputSearch placeholder="Nombre" />
		<DataTable>
			<Head>
				<Row>
					<Cell>Nombre</Cell>
					<Cell>Estado</Cell>
				</Row>
			</Head>
			<Body>
				<Row>
					<Cell>Bogota</Cell>
					<Cell>Activo</Cell>
				</Row>
			</Body>
		</DataTable>
	</Card>
</section>

<style>
	section {
		width: 80%;
		max-width: 500px;
		margin: 40px auto;
	}
</style>
