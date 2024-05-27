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
	TGuideServiceDOM,
	TGuideServiceFilterDOM
} from '$models/guides_service/entities';
import type { TGuideServiceAPI } from '$models/guides_service/dto';
import { guidesServiceAdapters } from '$models/guides_service/adapters';
import { buildGetNovelties } from './get_novelties';
import { buildGetServicesType } from './get_services_type';

export type Dependencies = {
	qs: (filter: TGuideServiceFilterDOM) => string;
	abortController: () => AbortController;
	http: AxiosInstance;
	adapter: TAdapters<TGuideServiceDOM, TGuideServiceAPI>;
};

const http = axios.create({
	baseURL: `${PUBLIC_API_LOCAL}/v1/guides_service`
});

const dependencies: Dependencies = {
	qs,
	abortController,
	http,
	adapter: guidesServiceAdapters
};

export const getAllGuidesService = buildGetAll(dependencies);
export const getGuidesServiceNolveties = buildGetNovelties(dependencies);
export const getGuidesServiceTypeServices = buildGetServicesType(dependencies);
export const getOneGuideService = buildGetOne(dependencies);
export const createOneGuideService = buildCreateOne(dependencies);
export const updateOneGuideService = buildUpdateOne(dependencies);
