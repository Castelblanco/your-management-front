import { TUserRoleDOM } from '@models/user_roles/entities';
import { create } from 'zustand';

type TUserRolesStore = {
    roles: TUserRoleDOM[];
    setRoles: (roles: TUserRoleDOM[]) => void;
};

export const useUserRoles = create<TUserRolesStore>((set) => ({
    roles: [],
    setRoles(roles) {
        set({ roles });
    },
}));
