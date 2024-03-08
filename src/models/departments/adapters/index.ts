import type { TAdapters } from '$common/base/adapters';
import {
	DepartmentDOM,
	type TDepartmentDOM,
	type TDepartmentStatusDOM
} from '../entities';
import { DepartmentAPI, type TDepartmentAPI, type TDepartmentStatusAPI } from '../dto';

class DepartmentAdapters implements TAdapters<TDepartmentDOM, TDepartmentAPI> {
	apiToDom = (item: TDepartmentAPI): TDepartmentDOM => {
		let status: TDepartmentStatusDOM | undefined;

		if (item.status) {
			status = {
				id: item.status._id,
				name: item.status.name
			};
		}

		return new DepartmentDOM({
			id: item._id,
			name: item.name,
			status
		});
	};

	domToApi = (item: TDepartmentDOM): TDepartmentAPI => {
		let status: TDepartmentStatusAPI | undefined;

		if (item.status) {
			status = {
				_id: item.status.id,
				name: item.status.name
			};
		}
		return new DepartmentAPI({
			_id: item.id,
			name: item.name,
			status
		});
	};
}

export const departmentsAdapters = new DepartmentAdapters();
