import type { ListResponse } from '$common/responses/list_response';
import type { TLegalClientAPI } from '$models/clients/legal/dto';
import type { TLegalClientFilterDOM } from '$models/clients/legal/entities';
import type { Dependencies } from '.';

export const buildGetAll = ({ http, qs, abortController }: Dependencies) => {
	const service = (filters: TLegalClientFilterDOM) => {
		const controller = abortController();

		return {
			response: http.get<ListResponse<TLegalClientAPI>>(`/get-all${qs(filters)}`, {
				signal: controller.signal
			}),
			controller
		};
	};

	return service;
};
