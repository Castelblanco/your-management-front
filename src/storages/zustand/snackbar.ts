import { ApiError } from '@common/errors/api_error';
import { formatTextError } from '@errors/map_errors';
import { create } from 'zustand';

type TSnackbarStore = {
    open: boolean;
    message: string;
    setSnackbar: (message: string) => void;
    setSnackbarError: (err: ApiError) => void;
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
    setSnackbarError(err) {
        set({ message: formatTextError(err), open: true });
    },
}));
