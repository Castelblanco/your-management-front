import type { ApiError } from '$common/errors/api_error';

export const MAP_ERRORS: Record<string, string> = {
	client_origin: 'Datos del Remitente',
	client_destination: 'Datos del Destinatario',
	commodity: 'Datos de la Mercancia',
	point_sale_origin: 'Datos del Punto de Origen',
	point_sale_destination: 'Datos del Punto de Destino',
	service: 'Datos del Tipo de Servicio',
	price: 'Precio',
	'Required property': 'son requerido',
	'Expected number to be greater or equal to 1': 'no puede ser 0'
};

export const formatTextError = (err: ApiError) => {
	if (err.message === 'VALIDATION') {
		const { metadata } = err;
		return `${MAP_ERRORS[metadata.at]} ${MAP_ERRORS[metadata.message]}`;
	}

	return 'Error de Servidor';
};
