import { Box, SelectChangeEvent } from '@mui/material';
import { useMap } from '@templates/map/hook';
import { ChangeEvent, useState } from 'react';
import { TGuideServiceDOM } from '@models/guides_service/entities';
import { useProfile } from '@storages/zustand/profile';
import { useCallServices } from '@hooks/use_call_services';
import { TNaturalClientDOM } from '@models/clients/natural/entities';
import { TLegalClientDOM } from '@models/clients/legal/entities';
import { TPointSaleDOM } from '@models/points_sale/entities';
import { useSnackbar } from '@storages/zustand/snackbar';
import { createId } from '@tools/create_id';
import { services } from '@tomtom-international/web-sdk-services';
import { TOMTOM_API_KEY } from '@constants/app';
import { liquidationFromPoint } from '@helpers/liquidation_from_point';
import { ButtonFloatingAdd } from '@molecules/buttons/floating_add';
import { ButtonFloatingLiquidation } from '@molecules/buttons/floating_liquidation';
import { useNovelties } from '@storages/zustand/novelties';
import { useStatusCode } from '@storages/zustand/status_code';
import { STATUS_CODE } from '@constants/status_code';
import { useNavigate } from 'react-router-dom';
import { guideServices } from '@services/guides_service';
import { guidesServiceAdapters } from '@models/guides_service/adapters';
import { formatTextError } from '@errors/map_errors';
import { ApiError } from '@common/errors/api_error';
import { ROUTES } from '@constants/routes';
import { FormGuidesService } from '@templates/forms/guides_service';
import { ButtonBack } from '@molecules/buttons/back';

const INITIAL_CLIENT_NATURAL: TNaturalClientDOM = {
    id: '',
    address: '',
    documentId: '',
    firstName: '',
    lastName: '',
    numberMovil: '',
    natural: true,
};

const INITIAL_CLIENT_LEGAL: TLegalClientDOM = {
    id: '',
    address: '',
    nit: '',
    businessName: '',
    numberMovil: '',
    natural: false,
};

export default function MainGuidesServiceCreate() {
    const { profile } = useProfile();
    const { setSnackbar } = useSnackbar();
    const { novelties } = useNovelties();
    const { statusCode } = useStatusCode();

    const [guide, setGuide] = useState<TGuideServiceDOM>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        id: undefined as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        number: undefined as any,
        commodity: [
            {
                units: 0,
                weight: 0,
            },
        ],
        price: 0,
        collection: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: profile,
        clientOrigin: { ...INITIAL_CLIENT_NATURAL },
        clientDestination: { ...INITIAL_CLIENT_NATURAL },
    });
    const [routeId, setRouteId] = useState('');
    const [enableCreate, setEnableCreate] = useState(false);

    const navigate = useNavigate();
    const { setMapControl, map } = useMap({});
    const { loading, callEndpointApi } = useCallServices();

    const handleChangeTypeService = ({ target }: SelectChangeEvent) => {
        setGuide({
            ...guide,
            service: {
                name: '',
                tab: '',
                id: target.value,
            },
        });
    };

    const toggleRequestCollection = (
        _: ChangeEvent<HTMLInputElement>,
        checked: boolean,
    ) => {
        setGuide({
            ...guide,
            collection: checked,
        });
    };

    // Handles Clients

    const toggleClientOriginTypeOrigin = (
        _: ChangeEvent<HTMLInputElement>,
        checked: boolean,
    ) => {
        if (checked) {
            return setGuide({
                ...guide,
                clientOrigin: {
                    ...INITIAL_CLIENT_NATURAL,
                    natural: checked,
                },
            });
        }

        return setGuide({
            ...guide,
            clientOrigin: {
                ...INITIAL_CLIENT_LEGAL,
                natural: checked,
            },
        });
    };

    const toggleClientDestinationType = (
        _: ChangeEvent<HTMLInputElement>,
        checked: boolean,
    ) => {
        if (checked) {
            return setGuide({
                ...guide,
                clientDestination: {
                    ...INITIAL_CLIENT_NATURAL,
                    natural: checked,
                },
            });
        }

        return setGuide({
            ...guide,
            clientDestination: {
                ...INITIAL_CLIENT_LEGAL,
                natural: checked,
            },
        });
    };

    const handleSelectNaturalClientOrigin = (value: TNaturalClientDOM) => {
        setGuide({
            ...guide,
            clientOrigin: value,
        });
    };

    const handleSelectLegalClientOrigin = (value: TLegalClientDOM) => {
        setGuide({
            ...guide,
            clientOrigin: value,
        });
    };

    const handleSelectNaturalClientDestination = (value: TNaturalClientDOM) => {
        setGuide({
            ...guide,
            clientDestination: value,
        });
    };

    const handleSelectLegalClientDestination = (value: TLegalClientDOM) => {
        setGuide({
            ...guide,
            clientDestination: value,
        });
    };

    // Handles Commodity

    const handleAddCommodity = () => {
        guide.commodity.push({
            units: 0,
            weight: 0,
        });
        setGuide({ ...guide });
    };

    const handleRemoveCommodity = (index: number) => {
        guide.commodity.splice(index, 1);
        setGuide({ ...guide });
    };

    const handleChangeCommodityUnits = (value: string, index: number) => {
        guide.commodity[index].units = +value;
        setGuide({ ...guide });
    };

    const handleChangeCommodityWeight = (value: string, index: number) => {
        guide.commodity[index].weight = +value;
        setGuide({ ...guide });
    };

    // Handles Points Sales

    const handleSelectPointSaleOrigin = (value: TPointSaleDOM) => {
        setGuide({ ...guide, pointSaleOrigin: value });
    };

    const handleSelectPointSaleDestination = (value: TPointSaleDOM) => {
        setGuide({ ...guide, pointSaleDestination: value });
    };

    // Actions
    const handleLiquidate = async () => {
        try {
            const checkCommodity = guide.commodity.some(
                (com) => com.units === 0 || com.weight === 0,
            );

            if (checkCommodity) {
                return setSnackbar('Datos de Mercaciona Invalidos');
            }

            if (!guide.pointSaleOrigin || !guide.pointSaleDestination) {
                return setSnackbar('Datos de Envio Invalidos');
            }

            await getRoutePointsSales();
        } catch (e) {
            console.log({ e });
        }
    };

    const getRoutePointsSales = async () => {
        if (!guide.pointSaleOrigin || !guide.pointSaleDestination) return;
        if (!map) return;

        if (routeId) map.removeLayer(routeId);

        const res = await services.calculateRoute({
            key: TOMTOM_API_KEY,
            locations: [
                [guide.pointSaleOrigin.longitude, guide.pointSaleOrigin.latitude],
                [
                    guide.pointSaleDestination.longitude,
                    guide.pointSaleDestination.latitude,
                ],
            ],
        });

        const [route] = res.routes;

        const { lengthInMeters } = route.summary;
        setGuide({
            ...guide,
            price: liquidationFromPoint(guide.commodity, lengthInMeters),
        });

        const newRouteId = createId();
        setRouteId(newRouteId);
        map.addLayer({
            id: newRouteId,
            type: 'line',
            source: {
                type: 'geojson',
                data: res.toGeoJson(),
            },
            layout: {
                'line-cap': 'round',
                'line-join': 'round',
            },
            paint: {
                'line-color': '#ff0000',
                'line-width': 2,
            },
        });

        map.setCenter([guide.pointSaleOrigin.longitude, guide.pointSaleOrigin.latitude]);
        map.setZoom(12);
        setEnableCreate(true);
    };

    const handleCreateGuide = async () => {
        try {
            const novelty = novelties.find(({ name }) => name === 'N/A')!;
            const status = statusCode.guides_service.find(
                ({ name }) => name === STATUS_CODE.ACTIVE,
            )!;

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (!guide.clientOrigin?.id) guide.clientOrigin = undefined as any;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (!guide.clientDestination?.id) guide.clientDestination = undefined as any;

            guide.novelty = novelty;
            guide.status = status;
            guide.createdAt = new Date();
            guide.updatedAt = new Date();

            const newGuide = await callEndpointApi(
                guideServices.createOne(guide),
                guidesServiceAdapters,
            );
            navigate(`${ROUTES.GUIDES_SERVICE}/${newGuide.id}`);
        } catch (e) {
            console.log({ e });
            setSnackbar(formatTextError(e as ApiError));
        }
    };

    const handleBack = () => navigate(ROUTES.GUIDES_SERVICE);

    return (
        <Box margin={'10px auto'} maxWidth={'1100px'} width={'95%'}>
            <Box marginY={'10px'}>
                <ButtonBack loading={loading} onClick={handleBack} />
            </Box>
            <FormGuidesService
                isCreate
                mapElement={setMapControl}
                guide={guide}
                onChangeTypeService={handleChangeTypeService}
                onClientOriginType={toggleClientOriginTypeOrigin}
                onSelectNaturalClientOrigin={handleSelectNaturalClientOrigin}
                onSelectLegalClientOrigin={handleSelectLegalClientOrigin}
                onChangeRequestCollection={toggleRequestCollection}
                onClientDestinationType={toggleClientDestinationType}
                onSelectNaturalClientDestination={handleSelectNaturalClientDestination}
                onSelectLegalClientDestination={handleSelectLegalClientDestination}
                onAddCommodity={handleAddCommodity}
                onRemoveCommodity={handleRemoveCommodity}
                onChangeCommodityUnits={handleChangeCommodityUnits}
                onChangeCommodityWeight={handleChangeCommodityWeight}
                onSelectPointSaleOrigin={handleSelectPointSaleOrigin}
                onSelectPointSaleDestination={handleSelectPointSaleDestination}
            />

            <ButtonFloatingLiquidation loading={loading} onClick={handleLiquidate} />
            {enableCreate && (
                <ButtonFloatingAdd loading={loading} onClick={handleCreateGuide} />
            )}
        </Box>
    );
}
