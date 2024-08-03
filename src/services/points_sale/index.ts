import { buildGetAll } from './get_all';
import { buildCreateOne } from './create_one';
import { buildGetOne } from './get_one';
import { buildUpdateOne } from './update_one';

import type { TPointSaleDOM, TPointSaleFilterDOM } from '$models/points_sale/entities';
import { abortController } from '$tools/index';
import axios, { type AxiosInstance } from 'axios';
import { qs } from '$helpers/index';
import type { TAdapters } from '$common/base/adapters';
import type { TPointSaleAPI } from '$models/points_sale/dto';
import { pointsSaleAdapters } from '$models/points_sale/adapters';

export type Dependencies = {
	qs: (filter: TPointSaleFilterDOM) => string;
	abortController: () => AbortController;
	http: AxiosInstance;
	adapter: TAdapters<TPointSaleDOM, TPointSaleAPI>;
};

const http = axios.create({
	baseURL: `https://dev-server-your-management.koyeb.app/v1/point-sales`
});

const dependencies: Dependencies = {
	qs,
	abortController,
	http,
	adapter: pointsSaleAdapters
};

export const getAllPointsSale = buildGetAll(dependencies);
export const getOnePointSale = buildGetOne(dependencies);
export const createOnePointSale = buildCreateOne(dependencies);
export const updateOnePointSale = buildUpdateOne(dependencies);
