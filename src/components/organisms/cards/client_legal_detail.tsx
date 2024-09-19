import { TLegalClientDOM } from '@models/clients/legal/entities';
import { Card, CardContent, CardHeader, Typography } from '@mui/material';

export type TCardClientLegalDetailProps = {
    client: TLegalClientDOM;
};

export const CardClientLegalDetail = ({ client }: TCardClientLegalDetailProps) => {
    return (
        <Card elevation={0}>
            <CardHeader title={client.businessName} />
            <CardContent>
                <Typography>Dirección: {client.address}</Typography>
                <Typography>Telefono: {client.numberMovil}</Typography>
            </CardContent>
        </Card>
    );
};
