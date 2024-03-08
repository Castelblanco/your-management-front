import type { ListResponse } from '$common/responses/list_response';
import type { TStatusCodeAPI } from '$models/status_code/dto';
import type { TStatusCodeType } from '$models/status_code/entities';
import type { Dependencies } from '.';

export const buildGetAll = ({ abortController, http, qs }: Dependencies) => {
	const service = (type: TStatusCodeType) => {
		const querys = qs({ type });
		const controller = abortController();
		const response = http.get<ListResponse<TStatusCodeAPI>>(`/get-all${querys}`, {
			signal: controller.signal
		});

		return {
			response,
			controller
		};
	};

	return service;
};
