import type { TGuideServiceCommodityDOM } from '$models/guides_service/entities';

export const addCommodityUnits = (commodity: TGuideServiceCommodityDOM[]): number => {
	return commodity.reduce((pre, comm) => {
		return (pre += comm.units);
	}, 0);
};
