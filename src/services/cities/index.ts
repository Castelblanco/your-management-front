import { buildGetAll } from './get_all';
import { buildCreateOne } from './create_one';
import { buildGetOne } from './get_one';
import { buildUpdateOne } from './update_one';

import type { TAdapters } from '$common/base/adapters';
import type { ListResponse } from '$common/responses/list_response';
import { PUBLIC_API_LOCAL } from '$env/static/public';
import type { CityAPI, TCityAPI } from '$models/cities/dto';
import type { TCityDOM, TCityFilterDOM } from '$models/cities/entities';
import { abortController } from '$tools/abort_controller';
import axios, { type AxiosInstance } from 'axios';
import { citiesAdapters } from '$models/cities/adapters';
import { qs } from '$helpers/qs';

export type Dependencies = {
	qs: (filter: TCityFilterDOM) => string;
	abortController: () => AbortController;
	http: AxiosInstance;
	adapter: TAdapters<TCityDOM, TCityAPI>;
};

const http = axios.create({
	baseURL: `${PUBLIC_API_LOCAL}/v1/cities`
});

const dependencies: Dependencies = {
	http,
	abortController,
	adapter: citiesAdapters,
	qs
};

export const getAllCities = buildGetAll(dependencies);
export const getOneCity = buildGetOne(dependencies);
export const createOneCity = buildCreateOne(dependencies);
export const updateOneCity = buildUpdateOne(dependencies);
export const DeleteOneCity = buildUpdateOne(dependencies);
