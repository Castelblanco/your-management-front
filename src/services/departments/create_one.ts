import type { ApiResponses } from '$common/responses/api_response';
import type { DepartmentAPI } from '$models/departments/dto';
import type { TDepartmentDOM } from '$models/departments/entities';
import type { Dependencies } from '.';

export const buildCreateOne = ({ abortController, http, adapter }: Dependencies) => {
	const service = (department: TDepartmentDOM) => {
		const controller = abortController();
		const response = http.post<ApiResponses<DepartmentAPI>>(
			`/create-one`,
			adapter.domToApi(department),
			{
				signal: controller.signal
			}
		);

		return {
			response,
			controller
		};
	};

	return service;
};
