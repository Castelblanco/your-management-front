import { TPointSaleDOM } from '@models/points_sale/entities';
import { TStatusCodeDOM } from '@models/status_code/entities';
import { TUserRoleDOM } from '@models/user_roles/entities';
import { TUserDOM } from '@models/users/entities';
import { ButtonSecondary } from '@molecules/buttons/secondary';
import {
    Autocomplete,
    Box,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Stack,
} from '@mui/material';
import { ChangeEvent, SyntheticEvent, useEffect, useState } from 'react';

import styles from './styles.module.css';
import { validObjects } from '@helpers/valid_objects';
import { Input } from '@atoms/input';
import { DropDownStatusCode } from '@organisms/dropdowns/status_code';
import { DropDownUserRoles } from '@organisms/dropdowns/user_roles';
import { CardPointSaleDetail } from '@organisms/cards/point_sale_detail';
import { useCallServices } from '@hooks/use_call_services';
import { pointsSaleServices } from '@services/points_sale';
import { pointsSaleAdapters } from '@models/points_sale/adapters';
import { useMap } from '@templates/map/hook';
import { Map } from '@templates/map';
import { useSnackbar } from '@storages/zustand/snackbar';
import { ApiError } from '@common/errors/api_error';

export type TFormUserProps = {
    title?: string;
    user?: TUserDOM;
    confirmPassword?: string;
    loading?: boolean;
    isCreate?: boolean;
    onChangeFirstName?: (e: ChangeEvent<HTMLInputElement>) => void;
    onChangeLastName?: (e: ChangeEvent<HTMLInputElement>) => void;
    onChangeDocument?: (e: ChangeEvent<HTMLInputElement>) => void;
    onChangeEmail?: (e: ChangeEvent<HTMLInputElement>) => void;
    onChangePhone?: (e: ChangeEvent<HTMLInputElement>) => void;
    onChangeAddress?: (e: ChangeEvent<HTMLInputElement>) => void;
    onChangePassword?: (e: ChangeEvent<HTMLInputElement>) => void;
    onChangeConfirmPassword?: (e: ChangeEvent<HTMLInputElement>) => void;
    onChangeStatus?: (status?: TStatusCodeDOM) => void;
    onChangeRole?: (role?: TUserRoleDOM) => void;
    onChangePointSale?: (value: TPointSaleDOM) => void;
    onCreate?: () => void;
    onUpdate?: () => void;
    onCancel?: () => void;
};

export const FormUser = ({
    title,
    user,
    confirmPassword,
    loading,
    isCreate,
    onChangeFirstName,
    onChangeLastName,
    onChangeDocument,
    onChangeEmail,
    onChangePhone,
    onChangeAddress,
    onChangePassword,
    onChangeConfirmPassword,
    onChangeStatus,
    onChangeRole,
    onChangePointSale,
    onCreate,
    onUpdate,
    onCancel,
}: TFormUserProps) => {
    const { setSnackbarError } = useSnackbar();
    const [userClone] = useState(user);
    const [points, setPoints] = useState<TPointSaleDOM[]>([]);

    const { mapElement, setMapControl, addOneMarker } = useMap({
        disable: true,
    });
    const {
        loading: loadingPoints,
        callEndpointList,
        cancelEndpoint,
    } = useCallServices();

    useEffect(() => {
        if (!user?.pointSale) return;
        addOneMarker(user.pointSale.longitude, user.pointSale.latitude);
    }, [mapElement]);

    const handleChangePointsSale = async ({ target }: ChangeEvent<HTMLInputElement>) => {
        try {
            cancelEndpoint();
            const { items } = await callEndpointList(
                pointsSaleServices.getAll({
                    limit: 20,
                    offset: 0,
                    name: target.value,
                }),
                pointsSaleAdapters,
            );
            setPoints([...items]);
        } catch (e) {
            setSnackbarError(e as ApiError);
        }
    };

    const handleChangePointSale = (
        _: SyntheticEvent<Element, Event>,
        value: TPointSaleDOM | null,
    ) => {
        if (!value) return;
        if (!onChangePointSale) return;
        addOneMarker(value.longitude, value.latitude);
        onChangePointSale(value);
    };

    const formatPointSale = (point: TPointSaleDOM) => point.name;

    const validPasswords = () => {
        if (!user?.password) return true;
        if (!confirmPassword) return true;
        return user.password !== confirmPassword;
    };

    return (
        <Card className={styles.container}>
            <CardHeader title={title} />
            <Box
                display={'flex'}
                justifyContent={'space-between'}
                maxHeight={'80vh'}
                overflow={'auto'}
            >
                <CardContent className={styles.box_form}>
                    <Stack gap={1}>
                        <Autocomplete
                            options={points}
                            loading={loadingPoints}
                            value={user?.pointSale}
                            onChange={handleChangePointSale}
                            getOptionLabel={formatPointSale}
                            loadingText="Buscando"
                            noOptionsText="Sin Resultados"
                            disabled={!isCreate}
                            renderInput={(params) => (
                                <Input
                                    {...params}
                                    onChange={handleChangePointsSale}
                                    label="Punto De Venta"
                                    required
                                />
                            )}
                        />
                        {user?.pointSale && (
                            <CardPointSaleDetail pointSale={user.pointSale} />
                        )}
                    </Stack>
                    <form className={styles.form}>
                        <Input
                            className={styles.input}
                            name="firstname"
                            label="Nombre"
                            onChange={onChangeFirstName}
                            value={user?.firstName}
                        />
                        <Input
                            className={styles.input}
                            name="lastname"
                            label="Apellido"
                            onChange={onChangeLastName}
                            value={user?.lastName}
                        />
                        <Input
                            className={styles.input}
                            name="email"
                            label="Correo"
                            onChange={onChangeEmail}
                            value={user?.email}
                        />
                        <Input
                            className={styles.input}
                            name="document"
                            label="Documento"
                            onChange={onChangeDocument}
                            value={user?.documentId}
                        />
                        <Input
                            className={styles.input}
                            name="number_movil"
                            label="Telefono"
                            onChange={onChangePhone}
                            value={user?.phone}
                        />
                        <Input
                            className={styles.input}
                            name="address"
                            label="Dirección"
                            onChange={onChangeAddress}
                            value={user?.address}
                        />
                        {isCreate && (
                            <>
                                <Input
                                    className={styles.input}
                                    name="password"
                                    label="Contraseña"
                                    onChange={onChangePassword}
                                    value={user?.password}
                                />
                                <Input
                                    className={styles.input}
                                    name="confirm_password"
                                    label="Confirmar Contraseña"
                                    onChange={onChangeConfirmPassword}
                                    value={confirmPassword}
                                />
                            </>
                        )}
                        <DropDownStatusCode
                            onChange={onChangeStatus}
                            value={user?.status?.id}
                            className={styles.input}
                            type="users"
                        />
                        <DropDownUserRoles
                            onChange={onChangeRole}
                            value={user?.role?.id}
                            className={styles.input}
                        />
                    </form>
                </CardContent>
                <CardContent>
                    <Map mapElement={setMapControl} />
                </CardContent>
            </Box>
            <CardActions>
                {isCreate ? (
                    <ButtonSecondary
                        loading={loading}
                        onClick={onCreate}
                        disabled={validPasswords()}
                    >
                        Crear
                    </ButtonSecondary>
                ) : (
                    <ButtonSecondary
                        disabled={validObjects(user, userClone)}
                        loading={loading}
                        onClick={onUpdate}
                    >
                        Actualizar
                    </ButtonSecondary>
                )}

                <ButtonSecondary onClick={onCancel}>Cancelar</ButtonSecondary>
            </CardActions>
        </Card>
    );
};
