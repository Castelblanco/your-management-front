import type { ApiResponses } from '$common/responses/api_response';
import type { TCityAPI } from '$models/cities/dto';
import type { TCityDOM } from '$models/cities/entities';
import type { Dependencies } from '.';

export const buildCreateOne = ({ abortController, http, adapter }: Dependencies) => {
	const service = (city: TCityDOM) => {
		const controller = abortController();

		return {
			response: http.post<ApiResponses<TCityAPI>>(`/create-one`, adapter.domToApi(city), {
				signal: controller.signal
			}),
			controller
		};
	};
	return service;
};
