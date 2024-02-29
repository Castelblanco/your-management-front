import { writable } from 'svelte/store';

type TAppTheme = 'dark' | 'light';

const theme = localStorage.getItem('app_theme');

const createAppTheme = () => {
	const { update, subscribe } = writable<TAppTheme>((theme as TAppTheme) || 'dark');

	const toogle = () => update((pre) => (pre === 'dark' ? 'light' : 'dark'));

	subscribe((theme) => {
		localStorage.setItem('app_theme', theme);
	});

	return {
		toogle,
		subscribe
	};
};

export const appTheme = createAppTheme();
