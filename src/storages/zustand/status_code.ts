import { TStatusCodeDOM, TStatusCodeType } from '@models/status_code/entities';
import { create } from 'zustand';

type TStatusCodeStore = {
    statusCode: Record<TStatusCodeType, TStatusCodeDOM[]>;
    setStatusCode: (type: TStatusCodeType, statusCode: TStatusCodeDOM[]) => void;
};

export const useStatusCode = create<TStatusCodeStore>((set, get) => ({
    statusCode: {
        clients: [],
        guides_service: [],
        points_sale: [],
        users: [],
    },
    setStatusCode(type, statusCode) {
        const codes = get().statusCode;
        set({ statusCode: { ...codes, [type]: statusCode } });
    },
}));
