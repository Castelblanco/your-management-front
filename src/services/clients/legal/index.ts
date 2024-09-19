import { buildGetAll } from './get_all';
import { buildCreateOne } from './create_one';
import { buildGetOne } from './get_one';
import { buildUpdateOne } from './update_one';

import { abortController } from '@tools/index';
import { type AxiosInstance } from 'axios';
import { qs } from '@helpers/index';
import type { TAdapters } from '@common/base/adapters';
import type {
    TLegalClientDOM,
    TLegalClientFilterDOM,
} from '@models/clients/legal/entities';
import type { TLegalClientAPI } from '@models/clients/legal/dto';
import { legalClientsAdapters } from '@models/clients/legal/adapters';
import { httpMonolith } from '@storages/axios/instances';

export type Dependencies = {
    qs: (filter: TLegalClientFilterDOM) => string;
    abortController: () => AbortController;
    http: AxiosInstance;
    adapter: TAdapters<TLegalClientDOM, TLegalClientAPI>;
};

export const PATH = '/v1/clients/legals';

const dependencies: Dependencies = {
    qs,
    abortController,
    http: httpMonolith,
    adapter: legalClientsAdapters,
};

const getAll = buildGetAll(dependencies);
const getOne = buildGetOne(dependencies);
const createOne = buildCreateOne(dependencies);
const updateOne = buildUpdateOne(dependencies);

export const clientLegalServices = {
    getAll,
    getOne,
    createOne,
    updateOne,
};
