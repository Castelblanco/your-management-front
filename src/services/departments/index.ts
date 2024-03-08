import { buildGetAll } from './get_all';
import { buildCreateOne } from './create_one';
import { buildGetOne } from './get_one';
import { buildUpdateOne } from './update_one';

import { PUBLIC_API_LOCAL } from '$env/static/public';
import type { TDepartmentDOM, TDepartmentFilterDOM } from '$models/departments/entities';
import { abortController } from '$tools/index';
import axios, { type AxiosInstance } from 'axios';
import { qs } from '$helpers/index';
import type { TAdapters } from '$common/base/adapters';
import type { TDepartmentAPI } from '$models/departments/dto';
import { departmentsAdapters } from '$models/departments/adapters';

export type Dependencies = {
	qs: (filter: TDepartmentFilterDOM) => string;
	abortController: () => AbortController;
	http: AxiosInstance;
	adapter: TAdapters<TDepartmentDOM, TDepartmentAPI>;
};

const http = axios.create({
	baseURL: `${PUBLIC_API_LOCAL}/v1/departments`
});

const dependencies: Dependencies = {
	qs,
	abortController,
	http,
	adapter: departmentsAdapters
};

export const getAllDepartments = buildGetAll(dependencies);
export const getOneDepartment = buildGetOne(dependencies);
export const createOneDepartment = buildCreateOne(dependencies);
export const updateOneDepartment = buildUpdateOne(dependencies);
