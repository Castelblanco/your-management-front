import { useCallServices } from '@hooks/use_call_services';
import { guidesServiceAdapters } from '@models/guides_service/adapters';
import { TGuideServiceDOM } from '@models/guides_service/entities';
import { ButtonBack } from '@molecules/buttons/back';
import { ButtonFloatingEdit } from '@molecules/buttons/floating_edit';
import { Box, SelectChangeEvent } from '@mui/material';
import { guideServices } from '@services/guides_service';
import { FormGuidesService } from '@templates/forms/guides_service';
import { useMap } from '@templates/map/hook';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '@constants/routes';
import { validObjects } from '@helpers/valid_objects';
import { createId } from '@tools/create_id';
import { services } from '@tomtom-international/web-sdk-services';
import { TOMTOM_API_KEY } from '@constants/app';
import { useSnackbar } from '@storages/zustand/snackbar';
import { ApiError } from '@common/errors/api_error';
import { useProfile } from '@storages/zustand/profile';
import { TStatusCodeDOM } from '@models/status_code/entities';

export default function MainGuidesServiceDetail() {
    const params = useParams<{ id: string }>();
    const { setSnackbar, setSnackbarError } = useSnackbar();
    const { profile } = useProfile();

    const [guide, setGuide] = useState<TGuideServiceDOM>();
    const [guideClone, setGuideClone] = useState<TGuideServiceDOM>();
    const [executeRoute, setExecuteRoute] = useState(true);

    const navigate = useNavigate();
    const { map, setMapControl } = useMap({
        disable: true,
    });
    const { loading, callEndpointApi } = useCallServices();

    useEffect(() => {
        (async () => {
            try {
                const guide = await callEndpointApi(
                    guideServices.getOne(params.id!, {
                        status: true,
                        novelty: true,
                        collection: true,
                        service: true,
                        pointSaleOrigin: true,
                        pointSaleDestination: true,
                        clientOrigin: true,
                        clientDestination: true,
                    }),
                    guidesServiceAdapters,
                );
                setGuide(guide);
                setGuideClone(guide);
            } catch (e) {
                setSnackbarError(e as ApiError);
            }
        })();
    }, []);

    useEffect(() => {
        getRoutePointsSales();
    }, [guide, map]);

    const handleChangeNovelty = ({ target }: SelectChangeEvent) => {
        setGuide({
            ...guide!,
            novelty: {
                name: '',
                id: target.value,
            },
        });
    };

    const handleChangeStatus = (status?: TStatusCodeDOM) => {
        setGuide({
            ...guide!,
            status,
        });
    };

    const getRoutePointsSales = async () => {
        if (!guide) return;
        if (!guide.pointSaleOrigin || !guide.pointSaleDestination) return;
        if (!map) return;
        if (!executeRoute) return;

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

        map.addLayer({
            id: createId(),
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
        setExecuteRoute(false);
    };

    const handleBack = () => navigate(ROUTES.GUIDES_SERVICE);

    const handleUpdateGuide = async () => {
        try {
            if (!guide) return;

            guide.user = profile;
            guide.updatedAt = new Date();
            const update = await callEndpointApi(
                guideServices.updateOne(guide),
                guidesServiceAdapters,
            );

            console.log({ update });

            setGuideClone(guide);
            setSnackbar('Guia Actualizada');
        } catch (e) {
            setSnackbarError(e as ApiError);
        }
    };

    return (
        <Box margin={'10px auto'} maxWidth={'1100px'} width={'95%'}>
            <Box marginY={'10px'}>
                <ButtonBack loading={loading} onClick={handleBack} />
            </Box>
            {!guide && <div ref={setMapControl} hidden />}
            {guide && (
                <FormGuidesService
                    isCreate={false}
                    mapElement={setMapControl}
                    guide={guide}
                    onChangeNovelty={handleChangeNovelty}
                    onChangeStatus={handleChangeStatus}
                />
            )}

            {!validObjects(guide, guideClone) && (
                <ButtonFloatingEdit loading={loading} onClick={handleUpdateGuide} />
            )}
        </Box>
    );
}
