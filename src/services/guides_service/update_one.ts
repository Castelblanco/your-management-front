import type { ApiResponses } from '@common/responses/api_response';
import type { TGuideServiceAPI } from '@models/guides_service/dto';
import type { TGuideServiceDOM } from '@models/guides_service/entities';
import { PATH, type Dependencies } from '.';

export const buildUpdateOne = ({ abortController, http, adapter }: Dependencies) => {
    const service = (guide: TGuideServiceDOM) => {
        const controller = abortController();

        return {
            response: http.put<ApiResponses<TGuideServiceAPI>>(
                `${PATH}/update-one/${guide.id}`,
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
