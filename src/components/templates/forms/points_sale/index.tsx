import { Input } from '@atoms/input';
import { ApiError } from '@common/errors/api_error';
import { TOMTOM_API_KEY } from '@constants/app';
import { TPointSaleDOM } from '@models/points_sale/entities';
import { ButtonSecondary } from '@molecules/buttons/secondary';
import {
    Autocomplete,
    Box,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    InputAdornment,
    Stack,
} from '@mui/material';
import { CardPointSaleDetail } from '@organisms/cards/point_sale_detail';
import { useSnackbar } from '@storages/zustand/snackbar';
import { Map } from '@templates/map';
import { useMap } from '@templates/map/hook';
import { services } from '@tomtom-international/web-sdk-services';
import { ChangeEvent, SyntheticEvent, useEffect, useState } from 'react';
import { validObjects } from '@helpers/valid_objects';
import { DropDownStatusCode } from '@organisms/dropdowns/status_code';
import { TStatusCodeDOM } from '@models/status_code/entities';

import styles from './styles.module.css';

export type TFormPointsSaleProps = {
    point?: TPointSaleDOM;
    isCreate?: boolean;
    loading?: boolean;
    onSelectUbication?: (value: TPointSaleDOM) => void;
    onChangeName?: (e: ChangeEvent<HTMLInputElement>) => void;
    onChangeBudget?: (e: ChangeEvent<HTMLInputElement>) => void;
    onChangeStatus?: (status?: TStatusCodeDOM) => void;
    onCreate?: () => void;
    onUpdate?: () => void;
    onCancel?: () => void;
};

export const FormPointsSale = ({
    point,
    isCreate,
    loading,
    onSelectUbication,
    onChangeName,
    onChangeBudget,
    onChangeStatus,
    onCreate,
    onUpdate,
    onCancel,
}: TFormPointsSaleProps) => {
    const { setSnackbarError } = useSnackbar();

    const [pointClone] = useState(point);
    const [points, setPoints] = useState<TPointSaleDOM[]>([]);
    const [loadingPoints, setLoadingPoints] = useState(false);
    const { mapElement, setMapControl, addManyMarker, resetMarkers, addOneMarker } =
        useMap({});

    useEffect(() => {
        if (!point) return;
        addOneMarker(point.longitude, point.latitude);
    }, [mapElement]);

    const handleChangeUbication = async ({ target }: ChangeEvent<HTMLInputElement>) => {
        try {
            setLoadingPoints(true);
            resetMarkers();
            const { results } = await services.fuzzySearch({
                key: TOMTOM_API_KEY,
                query: target.value,
                countrySet: 'CO',
            });

            if (!results) return;

            const points = results.map((ubication, i): TPointSaleDOM => {
                if (ubication.position) {
                    const { lng, lat } = ubication.position;
                    if (i === 0) addManyMarker(lng!, lat!);
                }

                return {
                    id: point?.id || '',
                    budget: point?.budget || 0,
                    name: point?.name || '',
                    address: ubication.address!.freeformAddress!,
                    department: ubication.address!.countrySubdivisionName!,
                    municipality: ubication.address!.municipality!,
                    neighborhood: ubication.address!.municipalitySubdivision!,
                    latitude: ubication.position!.lat!,
                    longitude: ubication.position!.lng!,
                };
            });

            setPoints([...points]);
        } catch (e) {
            setSnackbarError(e as ApiError);
        } finally {
            setLoadingPoints(false);
        }
    };

    const handleSelectPointSale = (
        _: SyntheticEvent<Element, Event>,
        value: TPointSaleDOM | null,
    ) => {
        if (!value) return;
        if (!onSelectUbication) return;
        addOneMarker(value.longitude, value.latitude);
        onSelectUbication(value);
    };

    const formatPointSale = (point: TPointSaleDOM) => point.address;

    return (
        <Card className={styles.container}>
            <CardHeader title="Detalle" />
            <Box display={'flex'} justifyContent={'space-between'}>
                <CardContent className={styles.box_form}>
                    <Stack gap={1}>
                        <Autocomplete
                            options={points}
                            loading={loadingPoints}
                            value={point}
                            onChange={handleSelectPointSale}
                            getOptionLabel={formatPointSale}
                            loadingText="Buscando"
                            noOptionsText="Sin Resultados"
                            disabled={!isCreate}
                            renderInput={(params) => (
                                <Input
                                    {...params}
                                    onChange={handleChangeUbication}
                                    label="Dirección"
                                    required
                                />
                            )}
                        />
                        {point?.address && (
                            <CardPointSaleDetail
                                pointSale={point}
                                title={point.address}
                            />
                        )}
                    </Stack>
                    <form className={styles.form}>
                        <Input
                            name="name"
                            label="Nombre"
                            value={point?.name}
                            onChange={onChangeName}
                        />
                        <Input
                            name="budget"
                            label="Presupuesto"
                            onChange={onChangeBudget}
                            value={point?.budget}
                            type="number"
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            COP
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />
                        <DropDownStatusCode
                            value={point?.status?.id}
                            type="points_sale"
                            onChange={onChangeStatus}
                        />
                    </form>
                </CardContent>
                <CardContent>
                    <Map mapElement={setMapControl} />
                </CardContent>
            </Box>
            <CardActions>
                {isCreate ? (
                    <ButtonSecondary loading={loading} onClick={onCreate}>
                        Crear
                    </ButtonSecondary>
                ) : (
                    <ButtonSecondary
                        loading={loading}
                        disabled={validObjects(point, pointClone)}
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
