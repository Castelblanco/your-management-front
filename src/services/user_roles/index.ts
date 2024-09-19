import { buildGetAll } from './get_all';

import { abortController } from '@tools/index';
import { type AxiosInstance } from 'axios';
import { qs } from '@helpers/index';
import { httpMonolith } from '@storages/axios/instances';

export type Dependencies = {
    qs: (object: object) => string;
    abortController: () => AbortController;
    http: AxiosInstance;
};

export const PATH = '/v1/user-roles';

const dependencies: Dependencies = {
    qs,
    abortController,
    http: httpMonolith,
};

const getAll = buildGetAll(dependencies);

export const userRoleServices = {
    getAll,
};
