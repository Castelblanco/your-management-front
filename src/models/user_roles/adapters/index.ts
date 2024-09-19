import { type TUserRoleAPI, UserRoleApi } from '../dto';
import { type TUserRoleDOM, UserRoleDOM } from '../entities';
import type { TAdapters } from '@common/base/adapters';

class UserRolesAdapters implements TAdapters<TUserRoleDOM, TUserRoleAPI> {
    apiToDom = (item: TUserRoleAPI): TUserRoleDOM => {
        return new UserRoleDOM({
            id: item._id,
            name: item.name,
        });
    };

    domToApi = (item: TUserRoleDOM): TUserRoleAPI => {
        return new UserRoleApi({
            _id: item.id,
            name: item.name,
        });
    };
}

export const userRolesAdapters = new UserRolesAdapters();
