import { create } from 'zustand';

type TSnackbarStore = {
    open: boolean;
    message: string;
    setSnackbar: (message: string) => void;
    setClose: () => void;
};

export const useSnackbar = create<TSnackbarStore>((set) => ({
    open: false,
    message: '',
    setClose() {
        set({ open: false });
    },
    setSnackbar(message) {
        set({ message, open: true });
    },
}));
