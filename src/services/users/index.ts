import { buildGetAll } from './get_all';
import { buildCreateOne } from './create_one';
import { buildGetOne } from './get_one';
import { buildUpdateOne } from './update_one';

import { PUBLIC_API_LOCAL } from '$env/static/public';
import { abortController, createFormData, dataURItoBlob } from '$tools/index';
import axios, { type AxiosInstance } from 'axios';
import { qs } from '$helpers/index';
import type { TAdapters } from '$common/base/adapters';
import type { TUserDOM, TUserFilterDOM } from '$models/users/entities';
import type { TUserAPI } from '$models/users/dto';
import { userAdapters } from '$models/users/adapters';
import { buildLogin } from './login';
import { buildUpdateOnePicture } from './update_one_picture';

export type Dependencies = {
	qs: (filter: TUserFilterDOM) => string;
	createFormData: (data: TUserAPI) => FormData;
	abortController: () => AbortController;
	http: AxiosInstance;
	adapter: TAdapters<TUserDOM, TUserAPI>;
	dataURItoBlob: (data: string) => Blob;
};

const http = axios.create({
	baseURL: `${PUBLIC_API_LOCAL}/v1/users`
});

const dependencies: Dependencies = {
	qs,
	abortController,
	http,
	adapter: userAdapters,
	createFormData,
	dataURItoBlob
};

export const userLogin = buildLogin(dependencies);
export const getAllUsers = buildGetAll(dependencies);
export const getOneUser = buildGetOne(dependencies);
export const createOneUser = buildCreateOne(dependencies);
export const updateOneUser = buildUpdateOne(dependencies);
export const updateOneUserPicture = buildUpdateOnePicture(dependencies);
