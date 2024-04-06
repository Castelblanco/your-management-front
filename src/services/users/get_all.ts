import type { ListResponse } from '$common/responses/list_response';
import type { TUserAPI } from '$models/users/dto';
import type { TUserFilterDOM } from '$models/users/entities';
import type { Dependencies } from '.';

export const buildGetAll = ({ http, qs, abortController }: Dependencies) => {
	const service = (filters: TUserFilterDOM) => {
		const controller = abortController();

		return {
			response: http.get<ListResponse<TUserAPI>>(`/get-all${qs(filters)}`, {
				signal: controller.signal
			}),
			controller
		};
	};

	return service;
};
