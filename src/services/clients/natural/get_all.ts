import type { ListResponse } from '@common/responses/list_response';
import type { TNaturalClientAPI } from '@models/clients/natural/dto';
import type { TNaturalClientFilterDOM } from '@models/clients/natural/entities';
import { PATH, type Dependencies } from '.';

export const buildGetAll = ({ http, qs, abortController }: Dependencies) => {
    const service = (filters: TNaturalClientFilterDOM) => {
        const controller = abortController();

        return {
            response: http.get<ListResponse<TNaturalClientAPI>>(
                `${PATH}/get-all${qs(filters)}`,
                {
                    signal: controller.signal,
                },
            ),
            controller,
        };
    };

    return service;
};
