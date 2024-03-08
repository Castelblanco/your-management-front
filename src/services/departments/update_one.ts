import type { ApiResponses } from '$common/responses/api_response';
import type { DepartmentAPI } from '$models/departments/dto';
import type { TDepartmentDOM } from '$models/departments/entities';
import type { Dependencies } from '.';

export const buildUpdateOne = ({ abortController, http, adapter }: Dependencies) => {
	const service = (department: TDepartmentDOM) => {
		const controller = abortController();
		const response = http.put<ApiResponses<DepartmentAPI>>(
			`/update-one/${department.id}`,
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
