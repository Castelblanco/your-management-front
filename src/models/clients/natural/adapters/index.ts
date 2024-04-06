import type { TAdapters } from '$common/base/adapters';
import {
	NaturalClientAPI,
	type TNaturalClientAPI,
	type TNaturalClientStatusAPI
} from '../dto';
import {
	NaturalClientDOM,
	type TNaturalClientDOM,
	type TNaturalClientStatusDOM
} from '../entities';

class NaturalClientAdapters implements TAdapters<TNaturalClientDOM, TNaturalClientAPI> {
	apiToDom = (item: TNaturalClientAPI): TNaturalClientDOM => {
		let status: TNaturalClientStatusDOM | undefined;

		if (item.status) {
			status = {
				id: item.status._id,
				name: item.status.name
			};
		}

		return new NaturalClientDOM({
			id: item._id,
			numberMovil: item.number_movil,
			address: item.address,
			documentId: item.document_id,
			firstName: item.first_name,
			lastName: item.last_name,
			natural: item.natural,
			status
		});
	};

	domToApi = (item: TNaturalClientDOM): TNaturalClientAPI => {
		let status: TNaturalClientStatusAPI | undefined;

		if (item.status) {
			status = {
				_id: item.status.id,
				name: item.status.name
			};
		}

		return new NaturalClientAPI({
			_id: item.id,
			number_movil: item.numberMovil,
			address: item.address,
			document_id: item.documentId,
			first_name: item.firstName,
			last_name: item.lastName,
			natural: item.natural,
			status
		});
	};
}

export const naturalClientsAdapters = new NaturalClientAdapters();
