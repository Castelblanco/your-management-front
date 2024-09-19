import type { ListResponse } from '@common/responses/list_response';
import type { TStatusCodeAPI } from '@models/status_code/dto';
import type { TStatusCodeType } from '@models/status_code/entities';
import { PATH, type Dependencies } from '.';

export const buildGetAll = ({ abortController, http, qs }: Dependencies) => {
    const service = (type: TStatusCodeType) => {
        const controller = abortController();
        return {
            response: http.get<ListResponse<TStatusCodeAPI>>(
                `${PATH}/get-all${qs({ type })}`,
                {
                    signal: controller.signal,
                },
            ),
            controller,
        };
    };

    return service;
};
