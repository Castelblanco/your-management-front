import type { ApiResponses } from '$common/responses/api_response';
import type { DepartmentAPI } from '$models/departments/dto';
import type { Dependencies } from '.';

export const buildGetOne = ({ abortController, http }: Dependencies) => {
	const service = (id: string) => {
		const controller = abortController();
		const response = http.get<ApiResponses<DepartmentAPI>>(`/get-one/${id}`, {
			signal: controller.signal
		});

		return {
			response,
			controller
		};
	};

	return service;
};
