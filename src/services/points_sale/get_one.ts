import type { ApiResponses } from '@common/responses/api_response';
import type { TPointSaleAPI } from '@models/points_sale/dto';
import { PATH, type Dependencies } from '.';

export const buildGetOne = ({ http, abortController }: Dependencies) => {
    const service = (id: string) => {
        const controller = abortController();
        return {
            response: http.get<ApiResponses<TPointSaleAPI>>(`${PATH}/get-one/${id}`, {
                signal: controller.signal,
            }),
            controller,
        };
    };

    return service;
};
