import type { ApiResponses } from '@common/responses/api_response';
import type { TUserAPI } from '@models/users/dto';
import { PATH, type Dependencies } from '.';

export const buildGetOne = ({ http, abortController }: Dependencies) => {
    const service = (id: string) => {
        const controller = abortController();
        return {
            response: http.get<ApiResponses<TUserAPI>>(`${PATH}/get-one/${id}`, {
                signal: controller.signal,
            }),
            controller,
        };
    };

    return service;
};
