import { ChangeEvent, useState } from 'react';
import { Card, CardActions, CardContent, CardHeader } from '@mui/material';
import { Input } from '@atoms/input';
import { ButtonSecondary } from '@molecules/buttons/secondary';
import { TNaturalClientDOM } from '@models/clients/natural/entities';
import { validObjects } from '@helpers/valid_objects';
import { DropDownStatusCode } from '@organisms/dropdowns/status_code';
import { TStatusCodeDOM } from '@models/status_code/entities';

import styles from './styles.module.css';

export type TFormClientNaturalProps = {
    title?: string;
    client?: TNaturalClientDOM;
    loading?: boolean;
    isCreate?: boolean;
    onChangeFirstName?: (e: ChangeEvent<HTMLInputElement>) => void;
    onChangeLastName?: (e: ChangeEvent<HTMLInputElement>) => void;
    onChangeNumberMovil?: (e: ChangeEvent<HTMLInputElement>) => void;
    onChangeAddress?: (e: ChangeEvent<HTMLInputElement>) => void;
    onChangeDocument?: (e: ChangeEvent<HTMLInputElement>) => void;
    onChangeStatus?: (status?: TStatusCodeDOM) => void;
    onCreate?: () => void;
    onUpdate?: () => void;
    onCancel?: () => void;
};

export const FormClientNatural = ({
    title,
    client,
    loading,
    isCreate,
    onChangeFirstName,
    onChangeLastName,
    onChangeNumberMovil,
    onChangeAddress,
    onChangeDocument,
    onChangeStatus,
    onCreate,
    onUpdate,
    onCancel,
}: TFormClientNaturalProps) => {
    const [clientClone] = useState(client);

    return (
        <Card className={styles.container}>
            <CardHeader title={title} />
            <CardContent>
                <form className={styles.form}>
                    <Input
                        value={client?.firstName}
                        fullWidth
                        label="Nombre"
                        name="firstname"
                        onChange={onChangeFirstName}
                    />
                    <Input
                        value={client?.lastName}
                        fullWidth
                        label="Apellido"
                        name="lastname"
                        onChange={onChangeLastName}
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
                        value={client?.documentId}
                        fullWidth
                        label="Documento"
                        name="document"
                        onChange={onChangeDocument}
                    />
                    <Input
                        value={client?.address}
                        fullWidth
                        label="Dirección"
                        name="address"
                        onChange={onChangeAddress}
                        className={isCreate ? styles.input : ''}
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
