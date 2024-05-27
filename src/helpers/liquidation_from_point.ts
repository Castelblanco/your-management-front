import type { TGuideServiceCommodityDOM } from '$models/guides_service/entities';

const NATIONAL_UNIT = 17100;
const REGIONAL_UNIT = 13600;
const URBAN_UNIT = 10000;

const SURCHARGE_NATIONAL_UNIT = 10000;
const SURCHARGE_REGIONAL_UNIT = 5000;
const SURCHARGE_URBAN_UNIT = 2000;

const DIFFERENCE_WEIGHT = 5;

export const liquidationFromPoint = (
	commodity: TGuideServiceCommodityDOM[],
	lengthInMeters: number
): number => {
	let priceUnit = 0;

	if (lengthInMeters <= 10000) priceUnit = URBAN_UNIT;
	else if (lengthInMeters <= 100000) priceUnit = REGIONAL_UNIT;
	else priceUnit = NATIONAL_UNIT;

	return commodity.reduce((_, { units, weight }) => {
		let price = priceUnit;
		if (price === URBAN_UNIT) price += calculateDifference(weight, SURCHARGE_URBAN_UNIT);
		else if (price === REGIONAL_UNIT)
			price += calculateDifference(weight, SURCHARGE_REGIONAL_UNIT);
		else if (price === NATIONAL_UNIT)
			price += calculateDifference(weight, SURCHARGE_NATIONAL_UNIT);

		return units * price;
	}, 0);
};

const calculateDifference = (weight: number, surchage: number) => {
	const difference = weight - DIFFERENCE_WEIGHT;
	return difference > 0 ? difference * surchage : 0;
};
