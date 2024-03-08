import type { ApiResponses } from '$common/responses/api_response';
import type { TCityAPI } from '$models/cities/dto';
import type { Dependencies } from '.';

export const buildGetOne = ({ abortController, http }: Dependencies) => {
	const service = (id: string) => {
		const controller = abortController();

		return {
			response: http.get<ApiResponses<TCityAPI>>(`/get-one/${id}`, {
				signal: controller.signal
			}),
			controller
		};
	};
	return service;
};
