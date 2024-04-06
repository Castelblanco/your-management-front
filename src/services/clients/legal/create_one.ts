import type { ApiResponses } from '$common/responses/api_response';
import type { TLegalClientAPI } from '$models/clients/legal/dto';
import type { TLegalClientDOM } from '$models/clients/legal/entities';
import type { Dependencies } from '.';

export const buildCreateOne = ({ http, abortController, adapter }: Dependencies) => {
	const service = (client: TLegalClientDOM) => {
		const controller = abortController();
		return {
			response: http.post<ApiResponses<TLegalClientAPI>>(
				`/create-one`,
				adapter.domToApi(client),
				{
					signal: controller.signal
				}
			),
			controller
		};
	};

	return service;
};
