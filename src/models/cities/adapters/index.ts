import {
	CityAPI,
	CityPointSaleAPI,
	type TCityStatusAPI,
	type TCityAPI,
	type TCityDepartmentAPI
} from '../dto';
import {
	CityDOM,
	CityPointSaleDOM,
	type TCityDepartmentDOM,
	type TCityStatusDOM,
	type TCityDOM
} from '../entities';
import type { TAdapters } from '$common/base/adapters';

class CitiesAdapters implements TAdapters<TCityDOM, TCityAPI> {
	apiToDom = (item: TCityAPI): TCityDOM => {
		const pointSales = item.point_sales?.map((point) => {
			return new CityPointSaleDOM({
				id: point._id,
				address: point.address,
				budget: point.budget,
				name: point.name,
				status: point.status
			});
		});

		let status: TCityStatusDOM | undefined;
		let department: TCityDepartmentDOM | undefined;

		if (item.status) {
			status = {
				id: item.status._id,
				name: item.status.name
			};
		}

		if (item.department) {
			department = {
				id: item.department._id,
				name: item.department.name
			};
		}

		return new CityDOM({
			id: item._id,
			name: item.name,
			status,
			department,
			pointSales
		});
	};

	domToApi = (item: TCityDOM): TCityAPI => {
		const pointSales = item.pointSales?.map((point) => {
			return new CityPointSaleAPI({
				_id: point.id,
				address: point.address,
				budget: point.budget,
				name: point.name,
				status: point.status
			});
		});

		let status: TCityStatusAPI | undefined;
		let department: TCityDepartmentAPI | undefined;

		if (item.status) {
			status = {
				_id: item.status.id,
				name: item.status.name
			};
		}

		if (item.department) {
			department = {
				_id: item.department.id,
				name: item.department.name
			};
		}

		return new CityAPI({
			_id: item.id,
			name: item.name,
			status,
			department,
			point_sales: pointSales
		});
	};
}

export const citiesAdapters = new CitiesAdapters();
