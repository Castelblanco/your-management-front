import type { ListResponse } from '$common/responses/list_response';
import type { TUserRoleAPI } from '$models/users/dto';
import type { Dependencies } from '.';

export const buildGetAll = ({ abortController, http }: Dependencies) => {
	const service = () => {
		const controller = abortController();
		const response = http.get<ListResponse<TUserRoleAPI>>(`/get-all`, {
			signal: controller.signal
		});

		return {
			response,
			controller
		};
	};

	return service;
};
