import type { LayoutLoad } from './$types';

export const ssr = false;

export const load: LayoutLoad = ({ route }) => {
	return {
		pathname: route.id
	};
};
