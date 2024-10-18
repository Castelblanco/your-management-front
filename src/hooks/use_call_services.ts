import { type TAdapters } from '@common/base/adapters';
import { ApiError } from '@common/errors/api_error';
import { ApiResponses } from '@common/responses/api_response';
import { ListResponse } from '@common/responses/list_response';
import { errorCancel } from '@errors/error_cancel';
import { getFilenameInDisposition } from '@helpers/get_filename_in_disposition';
import { downloadFile } from '@tools/dowload_file';
import axios, { type AxiosResponse } from 'axios';
import { useState } from 'react';

type TServiceResponse<T> = {
    response: Promise<AxiosResponse<T>>;
    controller: AbortController;
};

export const useCallServices = () => {
    const [loading, setLoading] = useState(false);
    const controllers: AbortController[] = [];

    const callEndpointList = async <E, D>(
        call: TServiceResponse<ListResponse<D>>,
        adapters: TAdapters<E, D>,
    ) => {
        setLoading(true);
        const index = controllers.push(call.controller);
        try {
            const { data } = await call.response;
            return {
                items: data.items.map(adapters.apiToDom),
                total: data.total,
            };
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            if (axios.isCancel(err)) throw new ApiError(errorCancel);
            throw new ApiError(err?.response?.data);
        } finally {
            controllers.splice(index, 1);
            setLoading(false);
        }
    };

    const callEndpointApi = async <E, D>(
        call: TServiceResponse<ApiResponses<D>>,
        adapter: TAdapters<E, D>,
    ): Promise<E> => {
        setLoading(true);
        const index = controllers.push(call.controller);
        try {
            const { data } = await call.response;
            return adapter.apiToDom(data.item);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            if (axios.isCancel(err)) throw new ApiError(errorCancel);
            throw new ApiError(err?.response?.data);
        } finally {
            controllers.splice(index, 1);
            setLoading(false);
        }
    };

    const callEndpointDowloadFile = async (call: TServiceResponse<Blob>) => {
        setLoading(true);
        const index = controllers.push(call.controller);
        try {
            const { data, headers } = await call.response;
            downloadFile(data, getFilenameInDisposition(headers['content-disposition']));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            if (axios.isCancel(err)) throw new ApiError(errorCancel);
            throw new ApiError(JSON.parse(await err?.response?.data.text()));
        } finally {
            controllers.splice(index, 1);
            setLoading(false);
        }
    };

    const callEndpoint = async (call: TServiceResponse<void>) => {
        setLoading(true);
        const index = controllers.push(call.controller);
        try {
            await call.response;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            if (axios.isCancel(err)) throw new ApiError(errorCancel);
            throw new ApiError(err?.response?.data);
        } finally {
            controllers.splice(index, 1);
            setLoading(false);
        }
    };

    const cancelEndpoint = () => {
        setLoading(false);
        controllers.forEach((ctrl) => ctrl.abort());
    };

    return {
        loading,
        callEndpointList,
        callEndpointApi,
        callEndpointDowloadFile,
        callEndpoint,
        cancelEndpoint,
    };
};
