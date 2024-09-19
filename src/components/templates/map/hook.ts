import { useAppTheme } from '@storages/zustand/app_theme';
import { useEffect, useRef, useState } from 'react';
import tt, {
    FullscreenControl,
    Marker,
    NavigationControl,
} from '@tomtom-international/web-sdk-maps';
import { TOMTOM_API_KEY } from '@constants/app';
import { streetDark, streetLight } from '@libs/index';

export type TMapHookProps = {
    disable?: boolean;
};

export const useMap = ({ disable }: TMapHookProps) => {
    const { mode } = useAppTheme();

    const [map, setMap] = useState<tt.Map>();

    let markerList = useRef<Marker[]>([]).current;
    const [mapElement, setMapElement] = useState<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!mapElement) return;

        const map = tt.map({
            key: TOMTOM_API_KEY,
            container: mapElement!,
            center: [-72.9301367, 4.1156735], // Colombia Coordinates
            zoom: 4.5,
            maxZoom: 20,
            doubleClickZoom: false,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            style: mode === 'dark' ? streetDark : (streetLight as any),
        });
        setMap(map);

        map.addControl(new FullscreenControl());
        map.addControl(new NavigationControl());

        map.on('dblclick', (e) => {
            if (disable) return;
            addOneMarker(e.lngLat.lng, e.lngLat.lat);
        });
        return () => map.remove();
    }, [mapElement]);

    useEffect(() => toggleMapStyle(), [mode]);

    const setMapControl = (el: HTMLDivElement | null) => setMapElement(el);

    const mapSetZoom = (zoom: number) => setMap((pre) => pre?.setZoom(zoom));

    const toggleMapStyle = () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map?.setStyle(mode === 'dark' ? streetDark : (streetLight as any));
    };

    const resetMarkers = () => {
        markerList.forEach((mk) => mk.remove());
        markerList = [];
    };

    const addOneMarker = (lng: number, lat: number) => {
        resetMarkers();
        setMap((map) => {
            if (!map) return map;
            const marker = new Marker().setLngLat([lng, lat]).addTo(map!);
            markerList.push(marker);
            map.setCenter([lng, lat]);
            mapSetZoom(15);
            return map;
        });
    };

    const addManyMarker = (lng: number, lat: number) => {
        setMap((map) => {
            if (!map) return map;
            const marker = new Marker().setLngLat([lng, lat]).addTo(map);
            markerList.push(marker);
            return map;
        });
        setMapZoomInBounds();
    };

    const setMapZoomInBounds = () => {
        setMap((map) => {
            if (!map) return map;
            const bounds = map.getBounds();
            markerList.forEach((mk) => bounds.extend(mk.getLngLat()));
            map.fitBounds(bounds);
            map.setZoom(5);
            return map;
        });
    };

    return {
        map,
        markerList,
        mapElement,
        setMapControl,
        mapSetZoom,
        toggleMapStyle,
        resetMarkers,
        addOneMarker,
        addManyMarker,
        setMapZoomInBounds,
    };
};
