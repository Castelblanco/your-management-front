import { buildGetAll } from './get_all';
import { buildCreateOne } from './create_one';
import { buildGetOne } from './get_one';
import { buildUpdateOne } from './update_one';

import { PUBLIC_API_LOCAL } from '$env/static/public';
import { abortController } from '$tools/index';
import axios, { type AxiosInstance } from 'axios';
import { qs } from '$helpers/index';
import type { TAdapters } from '$common/base/adapters';
import type {
	TNaturalClientDOM,
	TNaturalClientFilterDOM
} from '$models/clients/natural/entities';
import type { TNaturalClientAPI } from '$models/clients/natural/dto';
import { naturalClientsAdapters } from '$models/clients/natural/adapters';

export type Dependencies = {
	qs: (filter: TNaturalClientFilterDOM) => string;
	abortController: () => AbortController;
	http: AxiosInstance;
	adapter: TAdapters<TNaturalClientDOM, TNaturalClientAPI>;
};

const http = axios.create({
	baseURL: `${PUBLIC_API_LOCAL}/v1/clients/naturals`
});

const dependencies: Dependencies = {
	qs,
	abortController,
	http,
	adapter: naturalClientsAdapters
};

export const getAllNaturalClients = buildGetAll(dependencies);
export const getOneNaturalClient = buildGetOne(dependencies);
export const createOneNaturalClient = buildCreateOne(dependencies);
export const updateOneNaturalClient = buildUpdateOne(dependencies);
