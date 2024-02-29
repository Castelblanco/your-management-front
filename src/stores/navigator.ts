import { writable } from 'svelte/store';

const createNavigatorStore = () => {
	const { update, subscribe } = writable(false);

	const toogle = () => update((pre) => !pre);
	return {
		toogle,
		subscribe
	};
};

export const navigatorStore = createNavigatorStore();
