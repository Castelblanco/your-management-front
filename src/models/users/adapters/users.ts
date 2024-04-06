import {
	type TUserAPI,
	type TUserPointSaleAPI,
	UserAPI,
	UserPointSaleAPI,
	type TUserRoleAPI,
	type TUserStatusAPI
} from '../dto';
import {
	type TUserDOM,
	type TUserPointSaleDOM,
	UserDOM,
	UserPointSaleDOM,
	type TUserRoleDOM,
	type TUserStatusDOM
} from '../entities';
import type { TAdapters } from '$common/base/adapters';

class UsersAdatpers implements TAdapters<TUserDOM, TUserAPI> {
	apiToDom = (item: TUserAPI): TUserDOM => {
		let pointSale: TUserPointSaleDOM | undefined;

		if (item.point_sale) {
			const { point_sale: pointSaleApi } = item;
			pointSale = new UserPointSaleDOM({
				id: pointSaleApi._id,
				name: pointSaleApi.name,
				address: pointSaleApi.address,
				budget: pointSaleApi.budget,
				department: pointSaleApi.department,
				latitude: pointSaleApi.latitude,
				longitude: pointSaleApi.longitude,
				municipality: pointSaleApi.municipality,
				neighborhood: pointSaleApi.neighborhood
			});
		}

		let role: TUserRoleDOM | undefined;

		if (item.role) {
			role = {
				id: item.role._id,
				name: item.role.name
			};
		}

		let status: TUserStatusDOM | undefined;

		if (item.status) {
			status = {
				id: item.status._id,
				name: item.status.name
			};
		}

		return new UserDOM({
			id: item._id,
			firstName: item.first_name,
			lastName: item.last_name,
			documentId: item.document_id,
			email: item.email,
			password: item.password,
			phone: item.phone,
			address: item.address,
			role,
			status,
			createdAt: item.created_at,
			updatedAt: item.updated_at,
			pointSale
		});
	};

	domToApi = (item: TUserDOM): TUserAPI => {
		let pointSale: TUserPointSaleAPI | undefined;

		if (item.pointSale) {
			const { pointSale: pointSaleDom } = item;

			pointSale = new UserPointSaleAPI({
				_id: item.pointSale.id,
				name: item.pointSale.name,
				address: item.pointSale.address,
				budget: item.pointSale.budget,
				department: pointSaleDom.department,
				latitude: pointSaleDom.latitude,
				longitude: pointSaleDom.longitude,
				municipality: pointSaleDom.municipality,
				neighborhood: pointSaleDom.neighborhood
			});
		}

		let role: TUserRoleAPI | undefined;

		if (item.role) {
			role = {
				_id: item.role.id,
				name: item.role.name
			};
		}

		let status: TUserStatusAPI | undefined;

		if (item.status) {
			status = {
				_id: item.status.id,
				name: item.status.name
			};
		}

		return new UserAPI({
			_id: item.id,
			first_name: item.firstName,
			last_name: item.lastName,
			document_id: item.documentId,
			email: item.email,
			password: item.password,
			phone: item.phone,
			address: item.address,
			role,
			status,
			created_at: item.createdAt,
			updated_at: item.updatedAt,
			point_sale: pointSale
		});
	};
}

export const userAdapters = new UsersAdatpers();
