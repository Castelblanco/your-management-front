import type { TAdapters } from '@common/base/adapters';
import {
    PointSaleAPI,
    PointSaleUserAPI,
    type TPointSaleStatusAPI,
    type TPointSaleAPI,
} from '../dto';
import {
    PointSaleDOM,
    PointSaleUserDOM,
    type TPointSaleStatusDOM,
    type TPointSaleDOM,
} from '../entities';

class PointsSaleAdapters implements TAdapters<TPointSaleDOM, TPointSaleAPI> {
    apiToDom = (item: TPointSaleAPI): TPointSaleDOM => {
        const users = item.users?.map(
            (user) =>
                new PointSaleUserDOM({
                    id: user._id,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    documentId: user.document_id,
                    email: user.email,
                    phone: user.phone,
                    address: user.address,
                    role: {
                        id: user.role._id,
                        name: user.role.name,
                    },
                }),
        );

        let status: TPointSaleStatusDOM | undefined;

        if (item.status) {
            status = {
                id: item.status._id,
                name: item.status.name,
            };
        }

        return new PointSaleDOM({
            id: item._id,
            name: item.name,
            address: item.address,
            budget: item.budget,
            department: item.department,
            municipality: item.municipality,
            neighborhood: item.neighborhood,
            latitude: item.latitude,
            longitude: item.longitude,
            status,
            users,
        });
    };

    domToApi = (item: TPointSaleDOM): TPointSaleAPI => {
        const users = item.users?.map(
            (user) =>
                new PointSaleUserAPI({
                    _id: user.id,
                    first_name: user.firstName,
                    last_name: user.lastName,
                    document_id: user.documentId,
                    email: user.email,
                    phone: user.phone,
                    address: user.address,
                    role: {
                        _id: user.role.id,
                        name: user.role.name,
                    },
                }),
        );

        let status: TPointSaleStatusAPI | undefined;

        if (item.status) {
            status = {
                _id: item.status.id,
                name: item.status.name,
            };
        }

        return new PointSaleAPI({
            _id: item.id,
            name: item.name,
            address: item.address,
            budget: item.budget,
            department: item.department,
            municipality: item.municipality,
            neighborhood: item.neighborhood,
            latitude: item.latitude,
            longitude: item.longitude,
            status,
            users,
        });
    };
}

export const pointsSaleAdapters = new PointsSaleAdapters();
