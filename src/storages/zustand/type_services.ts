import { TGuideServiceTypeServiceDOM } from '@models/guides_service/entities';
import { create } from 'zustand';

type TTypeServicesStore = {
    typeServices: TGuideServiceTypeServiceDOM[];
    setTypeServices: (typeServices: TGuideServiceTypeServiceDOM[]) => void;
};

export const useTypeServices = create<TTypeServicesStore>((set) => ({
    typeServices: [],
    setTypeServices(typeServices) {
        set({ typeServices });
    },
}));
