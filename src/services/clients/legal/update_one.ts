import type { ApiResponses } from '@common/responses/api_response';
import type { TLegalClientAPI } from '@models/clients/legal/dto';
import type { TLegalClientDOM } from '@models/clients/legal/entities';
import { PATH, type Dependencies } from '.';

export const buildUpdateOne = ({ http, abortController, adapter }: Dependencies) => {
    const service = (client: TLegalClientDOM) => {
        const controller = abortController();
        return {
            response: http.put<ApiResponses<TLegalClientAPI>>(
                `${PATH}/update-one/${client.id}`,
                adapter.domToApi(client),
                {
                    signal: controller.signal,
                },
            ),
            controller,
        };
    };

    return service;
};
