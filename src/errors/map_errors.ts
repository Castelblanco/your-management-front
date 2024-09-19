import type { ApiError } from '@common/errors/api_error';

export const MAP_ERRORS: Record<string, string> = {
    'this user not exits': 'This user not exits',
    'password incorrect': 'Password Incorrect',
    client_origin: 'Datos del Remitente',
    client_destination: 'Datos del Destinatario',
    commodity: 'Datos de la Mercancia',
    point_sale_origin: 'Datos del Punto de Origen',
    point_sale_destination: 'Datos del Punto de Destino',
    service: 'Datos del Tipo de Servicio',
    price: 'Precio',
    'Required property': 'son requerido',
    'Expected number to be greater or equal to 1': 'no puede ser 0',
};

export const formatTextError = (err: ApiError): string => {
    if (err.message === 'VALIDATION') {
        const { metadata } = err;
        return `${MAP_ERRORS[metadata.at]} ${MAP_ERRORS[metadata.message]}`;
    }

    if (err.message === 'Storage error') {
        const { metadata } = err;
        return `${MAP_ERRORS[metadata.error || err.message]}`;
    }

    return MAP_ERRORS[err.message] || err.message;
};
