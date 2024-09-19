import type { ListResponse } from '@common/responses/list_response';
import type { TGuideServiceTypeServiceAPI } from '@models/guides_service/dto';
import { PATH, type Dependencies } from '.';

export const buildGetServicesType = ({ abortController, http }: Dependencies) => {
    const service = () => {
        const controller = abortController();

        return {
            response: http.get<ListResponse<TGuideServiceTypeServiceAPI>>(
                `${PATH}/get-services-type`,
                {
                    signal: controller.signal,
                },
            ),
            controller,
        };
    };

    return service;
};
