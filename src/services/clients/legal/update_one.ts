import type { ApiResponses } from '$common/responses/api_response';
import type { TLegalClientAPI } from '$models/clients/legal/dto';
import type { TLegalClientDOM } from '$models/clients/legal/entities';
import type { Dependencies } from '.';

export const buildUpdateOne = ({ http, abortController, adapter }: Dependencies) => {
	const service = (client: TLegalClientDOM) => {
		const controller = abortController();
		return {
			response: http.put<ApiResponses<TLegalClientAPI>>(
				`/update-one/${client.id}`,
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
