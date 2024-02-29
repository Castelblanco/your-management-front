import { type TMapper } from '$common/base/Imappers';
import { ApiError } from '$common/errors/api_error';
import { ApiResponses } from '$common/responses/api_response';
import { type TListResponses } from '$common/responses/list_response';
import { type AxiosResponse } from 'axios';
import { writable } from 'svelte/store';

type TServiceResponse<T> = {
	response: Promise<AxiosResponse<T>>;
	controller: AbortController;
};

export const callServices = () => {
	const loading = writable(false);
	const errorMessage = writable<ApiError | undefined>(undefined);
	let controller: AbortController;

	const callEndpointList = async <E, D>(
		axiosCall: TServiceResponse<TListResponses<D>>,
		mapper: TMapper<E, D>
	) => {
		loading.set(true);
		if (axiosCall.controller) controller = axiosCall.controller;

		try {
			const { data } = await axiosCall.response;
			return data.items.map(mapper.apiToDom);
		} catch (err: any) {
			const error = err?.response?.data;
			errorMessage.set(new ApiError(error));
		} finally {
			loading.set(false);
		}
	};

	const callEndpointApi = async <E, D>(
		axiosCall: TServiceResponse<ApiResponses<D>>,
		mapper: TMapper<E, D>
	) => {
		loading.set(true);
		if (axiosCall.controller) controller = axiosCall.controller;

		try {
			const { data } = await axiosCall.response;
			return mapper.apiToDom(data.item);
		} catch (err: any) {
			const error = err?.response?.data;
			errorMessage.set(new ApiError(error));
		} finally {
			loading.set(false);
		}
	};

	const callEndpoint = async <D>(axiosCall: TServiceResponse<ApiResponses<D>>) => {
		loading.set(true);
		if (axiosCall.controller) controller = axiosCall.controller;

		try {
			await axiosCall.response;
		} catch (err: any) {
			const error = err?.response?.data;
			errorMessage.set(new ApiError(error));
		} finally {
			loading.set(false);
		}
	};

	const cancelEndpoint = () => {
		loading.set(false);
		if (controller) controller.abort();
	};

	return {
		loading,
		errorMessage,
		callEndpointList,
		callEndpointApi,
		callEndpoint,
		cancelEndpoint
	};
};
