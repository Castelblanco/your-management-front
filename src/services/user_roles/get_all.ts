import type { ListResponse } from '@common/responses/list_response';
import type { TUserRoleAPI } from '@models/users/dto';
import { PATH, type Dependencies } from '.';

export const buildGetAll = ({ abortController, http }: Dependencies) => {
    const service = () => {
        const controller = abortController();
        return {
            response: http.get<ListResponse<TUserRoleAPI>>(`${PATH}/get-all`, {
                signal: controller.signal,
            }),
            controller,
        };
    };

    return service;
};
