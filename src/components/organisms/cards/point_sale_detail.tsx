import { TPointSaleDOM } from '@models/points_sale/entities';
import { Card, CardContent, CardHeader, Typography } from '@mui/material';

export type TCardPointSaleDetailProps = {
    pointSale: TPointSaleDOM;
    title?: string;
};

export const CardPointSaleDetail = ({ pointSale, title }: TCardPointSaleDetailProps) => {
    return (
        <Card elevation={8}>
            <CardHeader title={title || pointSale.name} />
            <CardContent>
                <Typography>Departamento: {pointSale.department}</Typography>
                <Typography>Municipio: {pointSale.municipality}</Typography>
                <Typography>Barrio: {pointSale.neighborhood}</Typography>
                <Typography>Latitud: {pointSale.latitude}</Typography>
                <Typography>Longitud: {pointSale.longitude}</Typography>
            </CardContent>
        </Card>
    );
};
