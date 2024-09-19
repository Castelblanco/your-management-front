import type { ApiResponses } from '@common/responses/api_response';
import type { TNaturalClientAPI } from '@models/clients/natural/dto';
import type { TNaturalClientDOM } from '@models/clients/natural/entities';
import { PATH, type Dependencies } from '.';

export const buildUpdateOne = ({ http, abortController, adapter }: Dependencies) => {
    const service = (client: TNaturalClientDOM) => {
        const controller = abortController();
        return {
            response: http.put<ApiResponses<TNaturalClientAPI>>(
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
