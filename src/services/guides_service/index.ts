import { buildGetAll } from './get_all';
import { buildCreateOne } from './create_one';
import { buildGetOne } from './get_one';
import { buildUpdateOne } from './update_one';

import { abortController } from '@tools/index';
import { type AxiosInstance } from 'axios';
import { qs } from '@helpers/index';
import type { TAdapters } from '@common/base/adapters';
import type {
    TGuideServiceDOM,
    TGuideServiceFilterDOM,
} from '@models/guides_service/entities';
import type { TGuideServiceAPI } from '@models/guides_service/dto';
import { guidesServiceAdapters } from '@models/guides_service/adapters';
import { buildGetNovelties } from './get_novelties';
import { buildGetServicesType } from './get_services_type';
import { httpMonolith } from '@storages/axios/instances';

export type Dependencies = {
    qs: (filter: TGuideServiceFilterDOM) => string;
    abortController: () => AbortController;
    http: AxiosInstance;
    adapter: TAdapters<TGuideServiceDOM, TGuideServiceAPI>;
};

export const PATH = '/v1/guides_service';

const dependencies: Dependencies = {
    qs,
    abortController,
    http: httpMonolith,
    adapter: guidesServiceAdapters,
};

export const getAll = buildGetAll(dependencies);
export const getOne = buildGetOne(dependencies);
export const createOne = buildCreateOne(dependencies);
export const updateOne = buildUpdateOne(dependencies);
export const getServicesType = buildGetServicesType(dependencies);
export const getNolveties = buildGetNovelties(dependencies);

export const guideServices = {
    getAll,
    getOne,
    createOne,
    updateOne,
    getServicesType,
    getNolveties,
};
