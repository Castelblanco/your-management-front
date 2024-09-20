import { Card, CardActions, CardContent, CardHeader } from '@mui/material';
import { TLegalClientDOM } from '@models/clients/legal/entities';
import { ChangeEvent, useState } from 'react';
import { TStatusCodeDOM } from '@models/status_code/entities';
import { Input } from '@atoms/input';
import { DropDownStatusCode } from '@organisms/dropdowns/status_code';
import { ButtonSecondary } from '@molecules/buttons/secondary';
import { validObjects } from '@helpers/valid_objects';

import styles from './styles.module.css';

export type TFormClientLegalProps = {
    title?: string;
    client?: TLegalClientDOM;
    loading?: boolean;
    isCreate?: boolean;
    onChangeBusinessName?: (e: ChangeEvent<HTMLInputElement>) => void;
    onChangeNit?: (e: ChangeEvent<HTMLInputElement>) => void;
    onChangeNumberMovil?: (e: ChangeEvent<HTMLInputElement>) => void;
    onChangeAddress?: (e: ChangeEvent<HTMLInputElement>) => void;
    onChangeStatus?: (status?: TStatusCodeDOM) => void;
    onCreate?: () => void;
    onUpdate?: () => void;
    onCancel?: () => void;
};

export const FormClientLegal = ({
    title,
    client,
    loading,
    isCreate,
    onChangeBusinessName,
    onChangeNit,
    onChangeNumberMovil,
    onChangeAddress,
    onChangeStatus,
    onCreate,
    onUpdate,
    onCancel,
}: TFormClientLegalProps) => {
    const [clientClone] = useState(client);

    return (
        <Card className={styles.container}>
            <CardHeader title={title} />
            <CardContent>
                <form className={styles.form}>
                    <Input
                        value={client?.businessName}
                        fullWidth
                        label="Nombre"
                        name="businessname"
                        onChange={onChangeBusinessName}
                    />
                    <Input
                        value={client?.nit}
                        fullWidth
                        label="Nit"
                        name="nit"
                        onChange={onChangeNit}
                    />
                    <Input
                        value={client?.numberMovil}
                        fullWidth
                        label="Telefono"
                        name="number_movil"
                        onChange={onChangeNumberMovil}
                    />
                    {!isCreate && (
                        <DropDownStatusCode
                            value={client?.status?.id}
                            fullWidth
                            onChange={onChangeStatus}
                            type="clients"
                        />
                    )}
                    <Input
                        value={client?.address}
                        fullWidth
                        label="Dirección"
                        name="address"
                        onChange={onChangeAddress}
                        className={!isCreate ? styles.input : ''}
                    />
                </form>
            </CardContent>
            <CardActions>
                {isCreate ? (
                    <ButtonSecondary onClick={onCreate} loading={loading}>
                        Crear
                    </ButtonSecondary>
                ) : (
                    <ButtonSecondary
                        onClick={onUpdate}
                        loading={loading}
                        disabled={validObjects(client, clientClone)}
                    >
                        Actualizar
                    </ButtonSecondary>
                )}
                <ButtonSecondary onClick={onCancel}>Cancelar</ButtonSecondary>
            </CardActions>
        </Card>
    );
};
