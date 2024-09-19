import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type TAppThemeStore = {
    mode: TAppThemeMode;
    setSwitchMode: () => void;
    setMode: (mode: TAppThemeMode) => void;
};

export type TAppThemeMode = 'dark' | 'light';

export const useAppTheme = create(
    persist<TAppThemeStore>(
        (set, get) => ({
            mode: 'light',
            setSwitchMode() {
                set({ mode: get().mode === 'dark' ? 'light' : 'dark' });
            },
            setMode(mode) {
                set({ mode });
            },
        }),
        {
            name: 'app_theme',
            storage: createJSONStorage(() => localStorage),
        },
    ),
);
