import type { ApiResponses } from '$common/responses/api_response';
import type { TUserLoginAPI } from '$models/users/dto';
import type { TInitUserLoginDOM } from '$models/users/entities';
import type { Dependencies } from '.';

export const buildLogin = ({ http, abortController }: Dependencies) => {
	const service = (profile: TInitUserLoginDOM) => {
		const controller = abortController();

		return {
			response: http.post<ApiResponses<TUserLoginAPI>>(`/login`, profile, {
				signal: controller.signal
			}),
			controller
		};
	};

	return service;
};
