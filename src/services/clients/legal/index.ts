import { buildGetAll } from './get_all';
import { buildCreateOne } from './create_one';
import { buildGetOne } from './get_one';
import { buildUpdateOne } from './update_one';

import { abortController } from '$tools/index';
import axios, { type AxiosInstance } from 'axios';
import { qs } from '$helpers/index';
import type { TAdapters } from '$common/base/adapters';
import type {
	TLegalClientDOM,
	TLegalClientFilterDOM
} from '$models/clients/legal/entities';
import type { TLegalClientAPI } from '$models/clients/legal/dto';
import { legalClientsAdapters } from '$models/clients/legal/adapters';

export type Dependencies = {
	qs: (filter: TLegalClientFilterDOM) => string;
	abortController: () => AbortController;
	http: AxiosInstance;
	adapter: TAdapters<TLegalClientDOM, TLegalClientAPI>;
};

const http = axios.create({
	baseURL: `https://dev-server-your-management.koyeb.app/v1/clients/legals`
});

const dependencies: Dependencies = {
	qs,
	abortController,
	http,
	adapter: legalClientsAdapters
};

export const getAllLegalClients = buildGetAll(dependencies);
export const getOneLegalClient = buildGetOne(dependencies);
export const createOneLegalClient = buildCreateOne(dependencies);
export const updateOneLegalClient = buildUpdateOne(dependencies);
