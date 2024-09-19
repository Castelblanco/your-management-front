import { TGuideServiceNoveltyDOM } from '@models/guides_service/entities';
import { create } from 'zustand';

type TNoveltiesStore = {
    novelties: TGuideServiceNoveltyDOM[];
    setNovelties: (novelties: TGuideServiceNoveltyDOM[]) => void;
};

export const useNovelties = create<TNoveltiesStore>((set) => ({
    novelties: [],
    setNovelties(novelties) {
        set({ novelties });
    },
}));
