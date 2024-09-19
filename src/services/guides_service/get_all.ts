import type { ListResponse } from '@common/responses/list_response';
import type { TGuideServiceAPI } from '@models/guides_service/dto';
import type { TGuideServiceFilterDOM } from '@models/guides_service/entities';
import { PATH, type Dependencies } from '.';

export const buildGetAll = ({ qs, abortController, http }: Dependencies) => {
    const service = (filter: TGuideServiceFilterDOM) => {
        const controller = abortController();

        return {
            response: http.get<ListResponse<TGuideServiceAPI>>(
                `${PATH}/get-all${qs(filter)}`,
                {
                    signal: controller.signal,
                },
            ),
            controller,
        };
    };

    return service;
};
