import type { ListResponse } from '$common/responses/list_response';
import type { TCityAPI } from '$models/cities/dto';
import type { TCityFilterDOM } from '$models/cities/entities';
import type { Dependencies } from '.';

export const buildGetAll = ({ abortController, http, qs }: Dependencies) => {
	const service = (filters: TCityFilterDOM) => {
		const controller = abortController();

		return {
			response: http.get<ListResponse<TCityAPI>>(`/get-all${qs(filters)}`, {
				signal: controller.signal
			}),
			controller
		};
	};
	return service;
};
