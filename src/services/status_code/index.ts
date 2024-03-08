import { PUBLIC_API_LOCAL } from '$env/static/public';
import { abortController } from '$tools/index';
import axios, { type AxiosInstance } from 'axios';
import { buildGetAll } from './get_all';
import { qs } from '$helpers/index';

const http = axios.create({
	baseURL: `${PUBLIC_API_LOCAL}/v1/status-code`
});

export type Dependencies = {
	qs: (object: object) => string;
	abortController: () => AbortController;
	http: AxiosInstance;
};

const dependencies: Dependencies = {
	qs,
	abortController,
	http
};

export const getAllStatusCode = buildGetAll(dependencies);
