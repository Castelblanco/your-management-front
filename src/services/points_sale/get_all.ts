import type { ListResponse } from '$common/responses/list_response';
import type { TPointSaleAPI } from '$models/points_sale/dto';
import type { TPointSaleFilterDOM } from '$models/points_sale/entities';
import type { Dependencies } from '.';

export const buildGetAll = ({ http, qs, abortController }: Dependencies) => {
	const service = (filters: TPointSaleFilterDOM) => {
		const controller = abortController();

		return {
			response: http.get<ListResponse<TPointSaleAPI>>(`/get-all${qs(filters)}`, {
				signal: controller.signal
			}),
			controller
		};
	};

	return service;
};
