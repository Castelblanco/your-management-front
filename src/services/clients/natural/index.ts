import { buildGetAll } from './get_all';
import { buildCreateOne } from './create_one';
import { buildGetOne } from './get_one';
import { buildUpdateOne } from './update_one';

import { abortController } from '@tools/index';
import { type AxiosInstance } from 'axios';
import { qs } from '@helpers/index';
import type { TAdapters } from '@common/base/adapters';
import type {
    TNaturalClientDOM,
    TNaturalClientFilterDOM,
} from '@models/clients/natural/entities';
import type { TNaturalClientAPI } from '@models/clients/natural/dto';
import { naturalClientsAdapters } from '@models/clients/natural/adapters';
import { httpMonolith } from '@storages/axios/instances';

export type Dependencies = {
    qs: (filter: TNaturalClientFilterDOM) => string;
    abortController: () => AbortController;
    http: AxiosInstance;
    adapter: TAdapters<TNaturalClientDOM, TNaturalClientAPI>;
};

export const PATH = '/v1/clients/naturals';

const dependencies: Dependencies = {
    qs,
    abortController,
    http: httpMonolith,
    adapter: naturalClientsAdapters,
};

const getAll = buildGetAll(dependencies);
const getOne = buildGetOne(dependencies);
const createOne = buildCreateOne(dependencies);
const updateOne = buildUpdateOne(dependencies);

export const clientNaturalServices = {
    getAll,
    getOne,
    createOne,
    updateOne,
};
