import {
    Autocomplete,
    Box,
    Card,
    CardContent,
    CardHeader,
    Divider,
    FormControlLabel,
    InputAdornment,
    SelectChangeEvent,
    Stack,
    Switch,
    Typography,
} from '@mui/material';

import { TGuideServiceDOM } from '@models/guides_service/entities';
import { formatNumber } from '@helpers/format_number';
import { DropDownNovelties } from '@organisms/dropdowns/novelties';
import { DropDownStatusCode } from '@organisms/dropdowns/status_code';
import { DropDownTypeServices } from '@organisms/dropdowns/type_services';
import { Input } from '@atoms/input';
import { ButtonAdd } from '@molecules/buttons/add';
import { ButtonDelete } from '@molecules/buttons/delete';
import { Map } from '@templates/map';
import { ChangeEvent, Ref, SyntheticEvent, useState } from 'react';
import { TNaturalClientDOM } from '@models/clients/natural/entities';
import { TLegalClientDOM } from '@models/clients/legal/entities';
import { TPointSaleDOM } from '@models/points_sale/entities';
import { useCallServices } from '@hooks/use_call_services';
import { clientNaturalServices } from '@services/clients/natural';
import { naturalClientsAdapters } from '@models/clients/natural/adapters';
import { clientLegalServices } from '@services/clients/legal';
import { legalClientsAdapters } from '@models/clients/legal/adapters';
import { pointsSaleServices } from '@services/points_sale';
import { pointsSaleAdapters } from '@models/points_sale/adapters';
import { CardPointSaleDetail } from '@organisms/cards/point_sale_detail';
import { CardClientNaturalDetail } from '@organisms/cards/client_natural_detail';
import { CardClientLegalDetail } from '@organisms/cards/client_legal_detail';
import { TStatusCodeDOM } from '@models/status_code/entities';
import { useSnackbar } from '@storages/zustand/snackbar';
import { ApiError } from '@common/errors/api_error';

import styles from './styles.module.css';

export type TFormGuidesServiceProps = {
    guide: TGuideServiceDOM;
    mapElement: Ref<HTMLDivElement>;
    isCreate: boolean;
    onChangeNovelty?: (e: SelectChangeEvent) => void;
    onChangeStatus?: (status?: TStatusCodeDOM) => void;
    onChangeTypeService?: (e: SelectChangeEvent) => void;
    onClientOriginType?: (e: ChangeEvent<HTMLInputElement>, checked: boolean) => void;
    onSelectNaturalClientOrigin?: (value: TNaturalClientDOM) => void;
    onSelectLegalClientOrigin?: (value: TLegalClientDOM) => void;
    onChangeRequestCollection?: (
        e: ChangeEvent<HTMLInputElement>,
        checked: boolean,
    ) => void;
    onClientDestinationType?: (
        e: ChangeEvent<HTMLInputElement>,
        checked: boolean,
    ) => void;
    onSelectNaturalClientDestination?: (value: TNaturalClientDOM) => void;
    onSelectLegalClientDestination?: (value: TLegalClientDOM) => void;
    onChangeCommodityUnits?: (value: string, index: number) => void;
    onChangeCommodityWeight?: (value: string, index: number) => void;
    onAddCommodity?: () => void;
    onRemoveCommodity?: (index: number) => void;
    onSelectPointSaleOrigin?: (value: TPointSaleDOM) => void;
    onSelectPointSaleDestination?: (value: TPointSaleDOM) => void;
};

export const FormGuidesService = ({
    guide,
    mapElement,
    isCreate,
    onChangeNovelty,
    onChangeStatus,
    onChangeTypeService,
    onClientOriginType,
    onSelectNaturalClientOrigin,
    onSelectLegalClientOrigin,
    onChangeRequestCollection,
    onSelectNaturalClientDestination,
    onSelectLegalClientDestination,
    onClientDestinationType,
    onChangeCommodityUnits,
    onChangeCommodityWeight,
    onAddCommodity,
    onRemoveCommodity,
    onSelectPointSaleOrigin,
    onSelectPointSaleDestination,
}: TFormGuidesServiceProps) => {
    const { setSnackbarError } = useSnackbar();
    const [naturalClients, setNaturalClients] = useState<TNaturalClientDOM[]>([]);
    const [legalClients, setLegalClients] = useState<TLegalClientDOM[]>([]);
    const [pointsSale, setPointsSale] = useState<TPointSaleDOM[]>([]);

    const { loading, callEndpointList, cancelEndpoint } = useCallServices();

    // Handles Http
    const handleChangeNaturalClient = async ({
        target,
    }: ChangeEvent<HTMLInputElement>) => {
        try {
            if (target.value === '') return;
            cancelEndpoint();
            const { items } = await callEndpointList(
                clientNaturalServices.getAll({
                    limit: 20,
                    offset: 0,
                    documentId: target.value,
                }),
                naturalClientsAdapters,
            );
            setNaturalClients([...items]);
        } catch (e) {
            setSnackbarError(e as ApiError);
        }
    };

    const handleChangeLegalClient = async ({ target }: ChangeEvent<HTMLInputElement>) => {
        try {
            if (target.value === '') return;
            cancelEndpoint();
            const { items } = await callEndpointList(
                clientLegalServices.getAll({
                    limit: 20,
                    offset: 0,
                    nit: target.value,
                }),
                legalClientsAdapters,
            );
            setLegalClients([...items]);
        } catch (e) {
            setSnackbarError(e as ApiError);
        }
    };

    const handleChangePointSale = async ({ target }: ChangeEvent<HTMLInputElement>) => {
        try {
            if (target.value === '') return;
            cancelEndpoint();
            const { items } = await callEndpointList(
                pointsSaleServices.getAll({
                    limit: 20,
                    offset: 0,
                    name: target.value,
                }),
                pointsSaleAdapters,
            );
            setPointsSale([...items]);
        } catch (e) {
            setSnackbarError(e as ApiError);
        }
    };

    // Handles Clients

    const handleSelectNaturalClientOrigin = (
        _: SyntheticEvent,
        value: TNaturalClientDOM | null,
    ) => {
        if (!value) return;
        if (!onSelectNaturalClientOrigin) return;
        onSelectNaturalClientOrigin(value);
        removeNaturalClientSelect(value);
    };

    const handleSelectLegalClientOrigin = (
        _: SyntheticEvent,
        value: TLegalClientDOM | null,
    ) => {
        if (!value) return;
        if (!onSelectLegalClientOrigin) return;
        onSelectLegalClientOrigin(value);
        removeLegalClientSelect(value);
    };

    const handleSelectNaturalClientDestination = (
        _: SyntheticEvent,
        value: TNaturalClientDOM | null,
    ) => {
        if (!value) return;
        if (!onSelectNaturalClientDestination) return;
        onSelectNaturalClientDestination(value);
        removeNaturalClientSelect(value);
    };

    const handleSelectLegalClientDestination = (
        _: SyntheticEvent,
        value: TLegalClientDOM | null,
    ) => {
        if (!value) return;
        if (!onSelectLegalClientDestination) return;
        onSelectLegalClientDestination(value);
        removeLegalClientSelect(value);
    };

    // Handles Commodity
    const handleChangeCommodityUnits = (
        { target }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        index: number,
    ) => {
        if (!onChangeCommodityUnits) return;
        onChangeCommodityUnits(target.value, index);
    };

    const handleChangeCommodityWeight = (
        { target }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        index: number,
    ) => {
        if (!onChangeCommodityWeight) return;
        onChangeCommodityWeight(target.value, index);
    };

    const handleRemoveCommodity = (index: number) => {
        if (!onRemoveCommodity) return;
        onRemoveCommodity(index);
    };

    // Handles Point Sale
    const handleSelectPointSaleOrigin = (
        _: SyntheticEvent,
        value: TPointSaleDOM | null,
    ) => {
        if (!value) return;
        if (!onSelectPointSaleOrigin) return;
        onSelectPointSaleOrigin(value);
        removePointSaleSelect(value);
    };

    const handleSelectPointSaleDestination = (
        _: SyntheticEvent,
        value: TPointSaleDOM | null,
    ) => {
        if (!value) return;
        if (!onSelectPointSaleDestination) return;
        onSelectPointSaleDestination(value);
        removePointSaleSelect(value);
    };

    // Actions Format
    const formatNaturalClient = (client: TNaturalClientDOM | null) => {
        return client?.documentId || '';
    };
    const formatLegalClient = (client: TLegalClientDOM | null) => client?.nit || '';
    const formatPointSale = (point: TPointSaleDOM) => point.name;

    // Actions Remove
    const removeNaturalClientSelect = (client: TNaturalClientDOM) => {
        setNaturalClients(naturalClients.filter((c) => c.id !== client.id));
    };

    const removeLegalClientSelect = (client: TLegalClientDOM) => {
        setLegalClients(legalClients.filter((c) => c.id !== client.id));
    };

    const removePointSaleSelect = (point: TPointSaleDOM) => {
        setPointsSale(pointsSale.filter((p) => p.id !== point.id));
    };

    return (
        <>
            <Box className={styles.container}>
                <Card>
                    <Card elevation={0}>
                        <CardHeader title="Informacion General" />
                        <CardContent>
                            <Stack
                                flexDirection={'row'}
                                justifyContent={'space-between'}
                                alignItems={'center'}
                                gap={2}
                            >
                                <Typography variant="h5" fontWeight={600}>
                                    Precio: ${formatNumber(guide.price)}
                                </Typography>
                                <Box className={styles.box_general_info_dropdowns}>
                                    <DropDownNovelties
                                        onChange={onChangeNovelty}
                                        value={guide.novelty?.id}
                                        disabled={isCreate}
                                        fullWidth
                                    />
                                    <Stack flexDirection={'row'} gap={1}>
                                        <DropDownStatusCode
                                            onChange={onChangeStatus}
                                            value={guide.status?.id}
                                            disabled={isCreate}
                                            className={styles.dropdown}
                                            type="guides_service"
                                        />
                                        <DropDownTypeServices
                                            onChange={onChangeTypeService}
                                            value={guide.service?.id}
                                            className={styles.dropdown}
                                            disabled={!isCreate}
                                        />
                                    </Stack>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                    <Divider />
                    <Card elevation={0}>
                        <CardHeader title="Datos del Remitente" />
                        <CardContent>
                            <Stack flexDirection={'row'} gap={2}>
                                <Box className={styles.box_sender_info}>
                                    <Stack
                                        flexDirection={'row'}
                                        alignItems={'center'}
                                        gap={1}
                                    >
                                        <Typography>
                                            {guide.clientOrigin?.natural
                                                ? 'Cliente Natural'
                                                : 'Cliente Juridico'}
                                        </Typography>
                                        <FormControlLabel
                                            control={
                                                <Switch onChange={onClientOriginType} />
                                            }
                                            checked={guide.clientOrigin?.natural}
                                            value={guide.clientOrigin?.natural}
                                            label={''}
                                            disabled={!isCreate}
                                        />
                                    </Stack>
                                    {guide.clientOrigin?.natural ? (
                                        <Autocomplete
                                            options={naturalClients}
                                            loading={loading}
                                            value={guide.clientOrigin}
                                            onChange={handleSelectNaturalClientOrigin}
                                            getOptionLabel={formatNaturalClient}
                                            loadingText="Buscando"
                                            noOptionsText="Sin Resultados"
                                            disabled={!isCreate}
                                            renderInput={(params) => (
                                                <Input
                                                    {...params}
                                                    onChange={handleChangeNaturalClient}
                                                    label="Documento"
                                                    required
                                                />
                                            )}
                                        />
                                    ) : (
                                        <Autocomplete
                                            options={legalClients}
                                            loading={loading}
                                            value={guide.clientOrigin}
                                            onChange={handleSelectLegalClientOrigin}
                                            getOptionLabel={formatLegalClient}
                                            loadingText="Buscando"
                                            noOptionsText="Sin Resultados"
                                            disabled={!isCreate}
                                            renderInput={(params) => (
                                                <Input
                                                    {...params}
                                                    onChange={handleChangeLegalClient}
                                                    label="Nit"
                                                    required
                                                />
                                            )}
                                        />
                                    )}

                                    <Stack
                                        flexDirection={'row'}
                                        alignItems={'center'}
                                        gap={1}
                                    >
                                        <Typography>Requiere Recogida</Typography>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    onChange={onChangeRequestCollection}
                                                />
                                            }
                                            checked={guide.collection}
                                            label={guide.collection ? 'Si' : 'No'}
                                            disabled={!isCreate}
                                        />
                                    </Stack>
                                </Box>
                                <Box className={styles.box_sender_info}>
                                    <Card elevation={0}>
                                        {guide.clientOrigin?.id && (
                                            <>
                                                {guide.clientOrigin?.natural && (
                                                    <CardClientNaturalDetail
                                                        client={guide.clientOrigin}
                                                    />
                                                )}

                                                {!guide.clientOrigin?.natural && (
                                                    <CardClientLegalDetail
                                                        client={guide.clientOrigin}
                                                    />
                                                )}
                                            </>
                                        )}
                                    </Card>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                    <Divider />
                    <Card elevation={0}>
                        <CardHeader title="Datos del Destinatario" />
                        <CardContent>
                            <Stack flexDirection={'row'} gap={2}>
                                <Box className={styles.box_sender_info}>
                                    <Stack
                                        flexDirection={'row'}
                                        alignItems={'center'}
                                        gap={1}
                                    >
                                        <Typography>
                                            {guide.clientDestination?.natural
                                                ? 'Cliente Natural'
                                                : 'Cliente Juridico'}
                                        </Typography>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    onChange={onClientDestinationType}
                                                />
                                            }
                                            checked={guide.clientDestination?.natural}
                                            value={guide.clientDestination?.natural}
                                            label={''}
                                            disabled={!isCreate}
                                        />
                                    </Stack>
                                    {guide.clientDestination?.natural ? (
                                        <Autocomplete
                                            options={naturalClients}
                                            loading={loading}
                                            value={guide.clientDestination}
                                            onChange={
                                                handleSelectNaturalClientDestination
                                            }
                                            getOptionLabel={formatNaturalClient}
                                            loadingText="Buscando"
                                            noOptionsText="Sin Resultados"
                                            disabled={!isCreate}
                                            renderInput={(params) => (
                                                <Input
                                                    {...params}
                                                    onChange={handleChangeNaturalClient}
                                                    label="Documento"
                                                    required
                                                />
                                            )}
                                        />
                                    ) : (
                                        <Autocomplete
                                            options={legalClients}
                                            loading={loading}
                                            value={guide.clientDestination}
                                            onChange={handleSelectLegalClientDestination}
                                            getOptionLabel={formatLegalClient}
                                            loadingText="Buscando"
                                            noOptionsText="Sin Resultados"
                                            disabled={!isCreate}
                                            renderInput={(params) => (
                                                <Input
                                                    {...params}
                                                    onChange={handleChangeLegalClient}
                                                    label="Nit"
                                                    required
                                                />
                                            )}
                                        />
                                    )}
                                </Box>
                                <Box className={styles.box_sender_info}>
                                    <Card elevation={0}>
                                        {guide.clientDestination?.id && (
                                            <>
                                                {guide.clientDestination?.natural && (
                                                    <CardClientNaturalDetail
                                                        client={guide.clientDestination}
                                                    />
                                                )}

                                                {!guide.clientDestination?.natural && (
                                                    <CardClientLegalDetail
                                                        client={guide.clientDestination}
                                                    />
                                                )}
                                            </>
                                        )}
                                    </Card>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                    <Divider />
                    <Card elevation={0}>
                        <CardHeader title="Datos de la Mercancia" />
                        <CardContent>
                            {guide.commodity.map((commodity, i) => (
                                <Stack
                                    flexDirection={'row'}
                                    justifyContent={'center'}
                                    alignItems={'center'}
                                    gap={1}
                                    marginTop={2}
                                    key={i}
                                >
                                    <Input
                                        value={commodity.units}
                                        required
                                        type="number"
                                        label="Unidades"
                                        onChange={(e) => handleChangeCommodityUnits(e, i)}
                                        disabled={!isCreate}
                                    />
                                    <Input
                                        value={commodity.weight}
                                        slotProps={{
                                            input: {
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        KG
                                                    </InputAdornment>
                                                ),
                                            },
                                        }}
                                        type="number"
                                        required
                                        label="Peso"
                                        onChange={(e) =>
                                            handleChangeCommodityWeight(e, i)
                                        }
                                        disabled={!isCreate}
                                    />
                                    {isCreate && (
                                        <>
                                            {i === 0 ? (
                                                <ButtonAdd
                                                    disabled={!isCreate}
                                                    onClick={onAddCommodity}
                                                />
                                            ) : (
                                                <ButtonDelete
                                                    onClick={() =>
                                                        handleRemoveCommodity(i)
                                                    }
                                                    disabled={!isCreate}
                                                />
                                            )}
                                        </>
                                    )}
                                </Stack>
                            ))}
                        </CardContent>
                    </Card>
                    <Divider />
                    <Card elevation={0}>
                        <CardHeader title="Datos de Envio" />
                        <CardContent>
                            <Stack flexDirection={'row'} gap={1}>
                                <Stack gap={1} width={'100%'}>
                                    <Autocomplete
                                        options={pointsSale}
                                        loading={loading}
                                        value={guide.pointSaleOrigin}
                                        onChange={handleSelectPointSaleOrigin}
                                        getOptionLabel={formatPointSale}
                                        loadingText="Buscando"
                                        noOptionsText="Sin Resultados"
                                        fullWidth
                                        disabled={!isCreate}
                                        renderInput={(params) => (
                                            <Input
                                                {...params}
                                                onChange={handleChangePointSale}
                                                label="Punto de Origen"
                                                required
                                            />
                                        )}
                                    />
                                    {guide.pointSaleOrigin && (
                                        <CardPointSaleDetail
                                            pointSale={guide.pointSaleOrigin}
                                        />
                                    )}

                                    <Autocomplete
                                        options={pointsSale}
                                        loading={loading}
                                        value={guide.pointSaleDestination}
                                        onChange={handleSelectPointSaleDestination}
                                        getOptionLabel={formatPointSale}
                                        loadingText="Buscando"
                                        noOptionsText="Sin Resultados"
                                        fullWidth
                                        disabled={!isCreate}
                                        renderInput={(params) => (
                                            <Input
                                                {...params}
                                                onChange={handleChangePointSale}
                                                label="Punto de Destino"
                                                required
                                            />
                                        )}
                                    />
                                    {guide.pointSaleDestination && (
                                        <CardPointSaleDetail
                                            pointSale={guide.pointSaleDestination}
                                        />
                                    )}
                                </Stack>
                                <Box>
                                    <Map mapElement={mapElement} />
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Card>
            </Box>
        </>
    );
};
