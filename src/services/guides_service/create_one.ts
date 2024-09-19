import type { ApiResponses } from '@common/responses/api_response';
import type { TGuideServiceAPI } from '@models/guides_service/dto';
import type { TGuideServiceDOM } from '@models/guides_service/entities';
import { PATH, type Dependencies } from '.';

export const buildCreateOne = ({ abortController, http, adapter }: Dependencies) => {
    const service = (guide: TGuideServiceDOM) => {
        const controller = abortController();

        return {
            response: http.post<ApiResponses<TGuideServiceAPI>>(
                `${PATH}/create-one`,
                adapter.domToApi(guide),
                {
                    signal: controller.signal,
                },
            ),
            controller,
        };
    };

    return service;
};
