import { buildGetAll } from './get_all';
import { buildCreateOne } from './create_one';
import { buildGetOne } from './get_one';
import { buildUpdateOne } from './update_one';

import type { TPointSaleDOM, TPointSaleFilterDOM } from '@models/points_sale/entities';
import { abortController } from '@tools/index';
import { type AxiosInstance } from 'axios';
import { qs } from '@helpers/index';
import type { TAdapters } from '@common/base/adapters';
import type { TPointSaleAPI } from '@models/points_sale/dto';
import { pointsSaleAdapters } from '@models/points_sale/adapters';
import { httpMonolith } from '@storages/axios/instances';

export type Dependencies = {
    qs: (filter: TPointSaleFilterDOM) => string;
    abortController: () => AbortController;
    http: AxiosInstance;
    adapter: TAdapters<TPointSaleDOM, TPointSaleAPI>;
};

export const PATH = '/v1/point-sales';

const dependencies: Dependencies = {
    qs,
    abortController,
    http: httpMonolith,
    adapter: pointsSaleAdapters,
};

export const getAll = buildGetAll(dependencies);
export const getOne = buildGetOne(dependencies);
export const createOne = buildCreateOne(dependencies);
export const updateOne = buildUpdateOne(dependencies);

export const pointsSaleServices = {
    getAll,
    getOne,
    createOne,
    updateOne,
};
