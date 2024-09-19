import { TNaturalClientDOM } from '@models/clients/natural/entities';
import { Card, CardContent, CardHeader, Typography } from '@mui/material';

export type TCardClientNaturalDetailProps = {
    client: TNaturalClientDOM;
};

export const CardClientNaturalDetail = ({ client }: TCardClientNaturalDetailProps) => {
    return (
        <Card elevation={0}>
            <CardHeader title={`${client.firstName} ${client.lastName}`} />
            <CardContent>
                <Typography>Dirección: {client.address}</Typography>
                <Typography>Telefono: {client.numberMovil}</Typography>
            </CardContent>
        </Card>
    );
};
