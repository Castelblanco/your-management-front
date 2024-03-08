import type { TAdapters } from '$common/base/adapters';
import { StatusCodeAPI, type TStatusCodeAPI } from '../dto';
import { StatusCodeDOM, type TStatusCodeDOM } from '../entities';

class StatusCodeAdapters implements TAdapters<TStatusCodeDOM, TStatusCodeAPI> {
	apiToDom = (item: TStatusCodeAPI): TStatusCodeDOM => {
		return new StatusCodeDOM({
			id: item._id,
			name: item.name
		});
	};

	domToApi = (item: TStatusCodeDOM): TStatusCodeAPI => {
		return new StatusCodeAPI({
			_id: item.id,
			name: item.name
		});
	};
}

export const statusCodeAdapters = new StatusCodeAdapters();
