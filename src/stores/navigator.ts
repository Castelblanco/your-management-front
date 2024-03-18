import { writable } from 'svelte/store';

const createNavigatorStore = () => {
	const { update, subscribe, set } = writable(false);

	const toogle = () => update((pre) => !pre);
	return {
		toogle,
		set,
		subscribe
	};
};

export const navigatorStore = createNavigatorStore();
