import type { ApiResponses } from '$common/responses/api_response';
import type { TGuideServiceAPI } from '$models/guides_service/dto';
import type { TGuideServiceRelations } from '$models/guides_service/entities';
import type { Dependencies } from '.';

export const buildGetOne = ({ qs, abortController, http }: Dependencies) => {
	const service = (id: string, relations: TGuideServiceRelations) => {
		const controller = abortController();
		const query = { ...relations, userId: '' };

		return {
			response: http.get<ApiResponses<TGuideServiceAPI>>(`/get-one/${id}${qs(query)}`, {
				signal: controller.signal
			}),
			controller
		};
	};

	return service;
};
