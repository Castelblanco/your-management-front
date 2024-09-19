import { TUserLoginDOM } from '@models/users/entities';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type TProfileStore = {
    profile: TUserLoginDOM;
    setProfile: (profile: TUserLoginDOM) => void;
    clearProfile: () => void;
};

const INITIAL_STATE: TUserLoginDOM = {
    id: '',
    firstName: '',
    lastName: '',
    documentId: '',
    email: '',
    phone: '',
    address: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    token: '',
};

export const useProfile = create(
    persist<TProfileStore>(
        (set) => ({
            profile: structuredClone(INITIAL_STATE),
            setProfile(profile) {
                set({ profile });
            },
            clearProfile() {
                set({ profile: structuredClone(INITIAL_STATE) });
            },
        }),
        {
            name: 'your-management-profile',
            storage: createJSONStorage(() => localStorage),
        },
    ),
);
