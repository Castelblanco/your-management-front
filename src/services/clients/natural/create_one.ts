import type { ApiResponses } from '@common/responses/api_response';
import type { TNaturalClientAPI } from '@models/clients/natural/dto';
import type { TNaturalClientDOM } from '@models/clients/natural/entities';
import { PATH, type Dependencies } from '.';

export const buildCreateOne = ({ http, abortController, adapter }: Dependencies) => {
    const service = (client: TNaturalClientDOM) => {
        const controller = abortController();
        return {
            response: http.post<ApiResponses<TNaturalClientAPI>>(
                `${PATH}/create-one`,
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
