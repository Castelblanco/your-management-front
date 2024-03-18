import type { ApiResponses } from '$common/responses/api_response';
import type { TPointSaleAPI } from '$models/points_sale/dto';
import type { TPointSaleDOM } from '$models/points_sale/entities';
import type { Dependencies } from '.';

export const buildUpdateOne = ({ http, abortController, adapter }: Dependencies) => {
	const service = (point: TPointSaleDOM) => {
		const controller = abortController();
		return {
			response: http.post<ApiResponses<TPointSaleAPI>>(
				`/update-one/${point.id}`,
				adapter.domToApi(point),
				{
					signal: controller.signal
				}
			),
			controller
		};
	};

	return service;
};
