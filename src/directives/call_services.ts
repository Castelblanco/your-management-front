import { type TAdapters } from '$common/base/adapters';
import { ApiError } from '$common/errors/api_error';
import { ApiResponses } from '$common/responses/api_response';
import { type TListResponses } from '$common/responses/list_response';
import { snackbarStore } from '$stores/snackbar';
import { type AxiosResponse } from 'axios';
import { get, writable } from 'svelte/store';
import { formatTextError } from '../errors/map_errors';

type TServiceResponse<T> = {
	response: Promise<AxiosResponse<T>>;
	controller: AbortController;
};

export const callServices = () => {
	const loading = writable(false);
	const errorMessage = writable<ApiError | undefined>(undefined);
	let controller: AbortController;

	const callEndpointList = async <E, D>(
		call: TServiceResponse<TListResponses<D>>,
		adapters: TAdapters<E, D>
	) => {
		loading.set(true);
		if (call.controller) controller = call.controller;
		try {
			const { data } = await call.response;
			return {
				items: data.items.map(adapters.apiToDom),
				total: data.total
			};
		} catch (err: any) {
			const error = new ApiError(err?.response?.data);
			errorMessage.set(error);
			snackbarStore.change({
				title: formatTextError(error),
				closeAction: true
			});
			throw error;
		} finally {
			loading.set(false);
		}
	};

	const callEndpointApi = async <E, D>(
		call: TServiceResponse<ApiResponses<D>>,
		adapter: TAdapters<E, D>
	): Promise<E> => {
		loading.set(true);
		if (call.controller) controller = call.controller;
		try {
			const { data } = await call.response;
			return adapter.apiToDom(data.item);
		} catch (err: any) {
			const error = new ApiError(err?.response?.data);
			errorMessage.set(error);
			snackbarStore.change({
				title: formatTextError(error),
				closeAction: true
			});
			throw error;
		} finally {
			loading.set(false);
		}
	};

	const callEndpoint = async <D>(call: TServiceResponse<ApiResponses<D>>) => {
		loading.set(true);
		if (call.controller) controller = call.controller;
		try {
			await call.response;
		} catch (err: any) {
			const error = new ApiError(err?.response?.data);
			errorMessage.set(error);
			snackbarStore.change({
				title: formatTextError(error),
				closeAction: true
			});
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
