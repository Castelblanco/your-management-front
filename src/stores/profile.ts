import type { TUserLoginDOM } from '$models/users/entities';
import { writable } from 'svelte/store';

const createProfileStore = () => {
	const localData = localStorage.getItem('your-management-profile');
	const localProfile: TUserLoginDOM | undefined =
		localData !== 'undefined' ? JSON.parse(localData as string) : undefined;

	const { set, subscribe } = writable<TUserLoginDOM | undefined>(
		localProfile || undefined
	);

	const change = (user: TUserLoginDOM) => set(user);
	const clear = () => set(undefined);

	subscribe((user) => {
		localStorage.setItem('your-management-profile', JSON.stringify(user));
	});

	return {
		change,
		subscribe,
		clear
	};
};

export const profileStore = createProfileStore();
