import { buildGetAll } from './get_all';
import { buildCreateOne } from './create_one';
import { buildGetOne } from './get_one';
import { buildUpdateOne } from './update_one';

import { abortController, createFormData, dataURItoBlob } from '@tools/index';
import { type AxiosInstance } from 'axios';
import { qs } from '@helpers/index';
import type { TAdapters } from '@common/base/adapters';
import type { TUserDOM, TUserFilterDOM } from '@models/users/entities';
import type { TUserAPI } from '@models/users/dto';
import { userAdapters } from '@models/users/adapters';
import { buildLogin } from './login';
import { buildUpdateOnePicture } from './update_one_picture';
import { httpMonolith } from '@storages/axios/instances';

export type Dependencies = {
    qs: (filter: TUserFilterDOM) => string;
    createFormData: (data: TUserAPI) => FormData;
    abortController: () => AbortController;
    http: AxiosInstance;
    adapter: TAdapters<TUserDOM, TUserAPI>;
    dataURItoBlob: (data: string) => Blob;
};

export const PATH = '/v1/users';

const dependencies: Dependencies = {
    qs,
    abortController,
    http: httpMonolith,
    adapter: userAdapters,
    createFormData,
    dataURItoBlob,
};

const login = buildLogin(dependencies);
const getAll = buildGetAll(dependencies);
const getOne = buildGetOne(dependencies);
const createOne = buildCreateOne(dependencies);
const updateOne = buildUpdateOne(dependencies);
const updatePicture = buildUpdateOnePicture(dependencies);

export const userServices = {
    login,
    getAll,
    getOne,
    createOne,
    updateOne,
    updatePicture,
};
