import type { ListResponse } from '$common/responses/list_response';
import type { TGuideServiceNoveltyAPI } from '$models/guides_service/dto';
import type { Dependencies } from '.';

export const buildGetNovelties = ({ abortController, http }: Dependencies) => {
	const service = () => {
		const controller = abortController();

		return {
			response: http.get<ListResponse<TGuideServiceNoveltyAPI>>(`/get-novelties`, {
				signal: controller.signal
			}),
			controller
		};
	};

	return service;
};
