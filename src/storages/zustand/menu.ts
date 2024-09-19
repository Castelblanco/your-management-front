import { create } from 'zustand';

type TMenuStore = {
    show: boolean;
    toggleShow: () => void;
};

export const useMenu = create<TMenuStore>((set, get) => ({
    show: false,
    toggleShow() {
        set({ show: !get().show });
    },
}));
