import { buildGetAll } from './get_all';

import { abortController } from '$tools/index';
import axios, { type AxiosInstance } from 'axios';
import { qs } from '$helpers/index';

const http = axios.create({
	baseURL: `https://dev-server-your-management.koyeb.app/v1/status-code`
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
