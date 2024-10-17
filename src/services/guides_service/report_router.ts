import type { TGuideServiceFilterDOM } from '@models/guides_service/entities';
import { PATH, type Dependencies } from '.';

export const buildReportRouter = ({ abortController, http }: Dependencies) => {
    const service = (filters: TGuideServiceFilterDOM) => {
        const controller = abortController();

        return {
            response: http.get<Blob>(`${PATH}/reports/router`, {
                signal: controller.signal,
                params: filters,
                responseType: 'blob',
            }),
            controller,
        };
    };

    return service;
};
