import type { TAdapters } from '$common/base/adapters';
import { GuideServiceTypeServiceAPI, type TGuideServiceTypeServiceAPI } from '../dto';
import {
	GuideServiceTypeServiceDOM,
	type TGuideServiceTypeServiceDOM
} from '../entities';

class GuideServiceTypeAdapter
	implements TAdapters<TGuideServiceTypeServiceDOM, TGuideServiceTypeServiceAPI>
{
	apiToDom = (item: TGuideServiceTypeServiceAPI): TGuideServiceTypeServiceDOM => {
		return new GuideServiceTypeServiceDOM({
			id: item._id,
			name: item.name,
			tab: item.tab
		});
	};
	domToApi = (item: TGuideServiceTypeServiceDOM): TGuideServiceTypeServiceAPI => {
		return new GuideServiceTypeServiceAPI({
			_id: item.id,
			name: item.name,
			tab: item.tab
		});
	};
}

export const guideServiceTypeAdapter = new GuideServiceTypeAdapter();
