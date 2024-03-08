import { writable } from 'svelte/store';

type TSnackbar = {
	title: string;
	closeAction?: boolean;
};

const createSnackbarStore = () => {
	const { set, subscribe } = writable<TSnackbar>({
		title: '',
		closeAction: false
	});

	const change = (options: TSnackbar) => set(options);
	return {
		change,
		subscribe
	};
};

export const snackbarStore = createSnackbarStore();
