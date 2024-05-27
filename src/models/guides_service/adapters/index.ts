/* eslint-disable @typescript-eslint/naming-convention */

import type { TAdapters } from '$common/base/adapters';
import {
	GuideServiceAPI,
	type TGuideServicePointSaleAPI,
	type TGuideServiceAPI,
	GuideServicePointSaleAPI,
	type TGuideServiceUserAPI,
	GuideServiceUserAPI,
	type TGuideServiceUserStatusAPI,
	type TGuideServiceUserRoleAPI,
	type TGuideServiceStatusAPI,
	type TGuideServiceNoveltyAPI,
	type TGuideServiceTypeServiceAPI,
	type TGuideServiceLegalClientAPI,
	type TGuideServiceNaturalClientAPI,
	GuideServiceLegalClientAPI,
	GuideServiceNaturalClientAPI
} from '../dto';
import {
	GuideServiceDOM,
	type TGuideServicePointSaleDOM,
	type TGuideServiceDOM,
	GuideServicePointSaleDOM,
	type TGuideServiceUserDOM,
	GuideServiceUserDOM,
	type TGuideServiceUserRoleDOM,
	type TGuideServiceUserStatusDOM,
	type TGuideServiceStatusDOM,
	type TGuideServiceNoveltyDOM,
	type TGuideServiceTypeServiceDOM,
	type TGuideServiceLegalClientDOM,
	type TGuideServiceNaturalClientDOM,
	GuideServiceLegalClientDOM,
	GuideServiceNaturalClientDOM
} from '../entities';

class GuideServiceAdapters implements TAdapters<TGuideServiceDOM, TGuideServiceAPI> {
	apiToDom = (item: TGuideServiceAPI): TGuideServiceDOM => {
		const {
			point_sale_origin,
			point_sale_destination,
			client_destination,
			client_origin
		} = item;

		let status: TGuideServiceStatusDOM | undefined;

		if (item.status) {
			status = {
				id: item.status._id,
				name: item.status.name
			};
		}

		let novelty: TGuideServiceNoveltyDOM | undefined;

		if (item.novelty) {
			novelty = {
				id: item.novelty._id,
				name: item.novelty.name
			};
		}

		let service: TGuideServiceTypeServiceDOM | undefined;

		if (item.service) {
			service = {
				id: item.service._id,
				name: item.service.name
			};
		}

		return new GuideServiceDOM({
			id: item._id,
			commodity: item.commodity,
			price: item.price,
			collection: item.collection,
			createdAt: item.created_at,
			updatedAt: item.updated_at,
			status,
			novelty,
			service,
			user: this.userApiToDom(item.user),
			clientDestination: client_destination && this.clientApiToDom(client_destination),
			clientOrigin: client_origin && this.clientApiToDom(client_origin),
			pointSaleOrigin: point_sale_origin && this.pointSaleApiToDom(point_sale_origin),
			pointSaleDestination:
				point_sale_destination && this.pointSaleApiToDom(point_sale_destination)
		});
	};

	domToApi = (item: TGuideServiceDOM): TGuideServiceAPI => {
		const { pointSaleDestination, pointSaleOrigin, clientOrigin, clientDestination } =
			item;

		let status: TGuideServiceStatusAPI | undefined;

		if (item.status) {
			status = {
				_id: item.status.id,
				name: item.status.name
			};
		}

		let novelty: TGuideServiceNoveltyAPI | undefined;

		if (item.novelty) {
			novelty = {
				_id: item.novelty.id,
				name: item.novelty.name
			};
		}

		let service: TGuideServiceTypeServiceAPI | undefined;

		if (item.service) {
			service = {
				_id: item.service.id,
				name: item.service.name
			};
		}

		return new GuideServiceAPI({
			_id: item.id,
			commodity: item.commodity,
			price: item.price,
			collection: item.collection,
			created_at: item.createdAt,
			updated_at: item.updatedAt,
			status,
			novelty,
			service,
			user: this.userDomToApi(item.user),
			client_destination: clientDestination && this.clientDomToApi(clientDestination),
			client_origin: clientOrigin && this.clientDomToApi(clientOrigin),
			point_sale_origin: pointSaleOrigin && this.pointSaleDomToApi(pointSaleOrigin),
			point_sale_destination:
				pointSaleDestination && this.pointSaleDomToApi(pointSaleDestination)
		});
	};

	pointSaleDomToApi = (
		pointSale: TGuideServicePointSaleDOM
	): TGuideServicePointSaleAPI => {
		return new GuideServicePointSaleAPI({
			_id: pointSale.id,
			name: pointSale.name,
			address: pointSale.address,
			department: pointSale.department,
			municipality: pointSale.municipality,
			neighborhood: pointSale.neighborhood,
			latitude: pointSale.latitude,
			longitude: pointSale.longitude,
			budget: pointSale.budget
		});
	};

	pointSaleApiToDom = (
		pointSale: TGuideServicePointSaleAPI
	): TGuideServicePointSaleDOM => {
		return new GuideServicePointSaleDOM({
			id: pointSale._id,
			name: pointSale.name,
			address: pointSale.address,
			department: pointSale.department,
			municipality: pointSale.municipality,
			neighborhood: pointSale.neighborhood,
			latitude: pointSale.latitude,
			longitude: pointSale.longitude,
			budget: pointSale.budget
		});
	};

	userDomToApi = (user?: TGuideServiceUserDOM): TGuideServiceUserAPI | undefined => {
		if (!user) return;

		let status: TGuideServiceUserStatusAPI | undefined;

		if (user.status) {
			status = {
				_id: user.status.id,
				name: user.status.name
			};
		}

		let role: TGuideServiceUserRoleAPI | undefined;

		if (user.role) {
			role = {
				_id: user.role.id,
				name: user.role.name
			};
		}

		return new GuideServiceUserAPI({
			_id: user.id,
			first_name: user.firstName,
			last_name: user.lastName,
			document_id: user.documentId,
			email: user.email,
			phone: user.phone,
			address: user.address,
			status,
			role
		});
	};

	userApiToDom = (user?: TGuideServiceUserAPI): TGuideServiceUserDOM | undefined => {
		if (!user) return;

		let status: TGuideServiceUserStatusDOM | undefined;

		if (user.status) {
			status = {
				id: user.status._id,
				name: user.status.name
			};
		}

		let role: TGuideServiceUserRoleDOM | undefined;

		if (user.role) {
			role = {
				id: user.role._id,
				name: user.role.name
			};
		}

		return new GuideServiceUserDOM({
			id: user._id,
			firstName: user.first_name,
			lastName: user.last_name,
			documentId: user.document_id,
			email: user.email,
			phone: user.phone,
			address: user.address,
			status,
			role
		});
	};

	clientApiToDom = (
		client: TGuideServiceLegalClientAPI | TGuideServiceNaturalClientAPI
	): TGuideServiceLegalClientDOM | TGuideServiceNaturalClientDOM => {
		if (client instanceof GuideServiceLegalClientAPI) {
			return new GuideServiceLegalClientDOM({
				id: client._id,
				numberMovil: client.number_movil,
				address: client.address,
				nit: client.nit,
				businessName: client.business_name
			});
		}

		const defaultClient = client as TGuideServiceNaturalClientAPI;

		return new GuideServiceNaturalClientDOM({
			id: defaultClient._id,
			numberMovil: defaultClient.number_movil,
			address: defaultClient.address,
			documentId: defaultClient.document_id,
			firstName: defaultClient.first_name,
			lastName: defaultClient.last_name
		});
	};

	clientDomToApi = (
		client: TGuideServiceLegalClientDOM | TGuideServiceNaturalClientDOM
	): TGuideServiceLegalClientAPI | TGuideServiceNaturalClientAPI => {
		if (client instanceof GuideServiceLegalClientDOM) {
			return new GuideServiceLegalClientAPI({
				_id: client.id,
				number_movil: client.numberMovil,
				address: client.address,
				nit: client.nit,
				business_name: client.businessName
			});
		}

		const defaultClient = client as TGuideServiceNaturalClientDOM;

		return new GuideServiceNaturalClientAPI({
			_id: defaultClient.id,
			number_movil: defaultClient.numberMovil,
			address: defaultClient.address,
			document_id: defaultClient.documentId,
			first_name: defaultClient.firstName,
			last_name: defaultClient.lastName
		});
	};
}

export const guidesServiceAdapters = new GuideServiceAdapters();
