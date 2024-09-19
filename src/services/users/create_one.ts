import type { ApiResponses } from '@common/responses/api_response';
import type { TUserAPI } from '@models/users/dto';
import type { TUserDOM } from '@models/users/entities';
import { PATH, type Dependencies } from '.';

export const buildCreateOne = ({ http, abortController, adapter }: Dependencies) => {
    const service = (user: TUserDOM) => {
        const controller = abortController();
        return {
            response: http.post<ApiResponses<TUserAPI>>(
                `${PATH}/create-one`,
                adapter.domToApi(user),
                {
                    signal: controller.signal,
                },
            ),
            controller,
        };
    };

    return service;
};
