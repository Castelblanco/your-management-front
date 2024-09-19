import type { TAdapters } from '@common/base/adapters';
import { LegalClientAPI, type TLegalClientAPI, type TLegalClientStatusAPI } from '../dto';
import {
    LegalClientDOM,
    type TLegalClientDOM,
    type TLegalClientStatusDOM,
} from '../entities';

class LegalClientAdapters implements TAdapters<TLegalClientDOM, TLegalClientAPI> {
    apiToDom = (item: TLegalClientAPI): TLegalClientDOM => {
        let status: TLegalClientStatusDOM | undefined;

        if (item.status) {
            status = {
                id: item.status._id,
                name: item.status.name,
            };
        }

        return new LegalClientDOM({
            id: item._id,
            numberMovil: item.number_movil,
            address: item.address,
            nit: item.nit,
            businessName: item.business_name,
            natural: item.natural,
            status,
        });
    };

    domToApi = (item: TLegalClientDOM): TLegalClientAPI => {
        let status: TLegalClientStatusAPI | undefined;

        if (item.status) {
            status = {
                _id: item.status.id,
                name: item.status.name,
            };
        }

        return new LegalClientAPI({
            _id: item.id,
            number_movil: item.numberMovil,
            address: item.address,
            nit: item.nit,
            business_name: item.businessName,
            natural: item.natural,
            status,
        });
    };
}

export const legalClientsAdapters = new LegalClientAdapters();
