import type { ListResponse } from '$common/responses/list_response';
import type { DepartmentAPI } from '$models/departments/dto';
import type { TDepartmentFilterDOM } from '$models/departments/entities';
import type { Dependencies } from '.';

export const buildGetAll = ({ qs, abortController, http }: Dependencies) => {
	const service = (filter: TDepartmentFilterDOM) => {
		const querys = qs(filter);
		const controller = abortController();
		const response = http.get<ListResponse<DepartmentAPI>>(`/get-all${querys}`, {
			signal: controller.signal
		});

		return {
			response,
			controller
		};
	};

	return service;
};
