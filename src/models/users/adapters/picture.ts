import { TAdapters } from '@common/base/adapters';
import { TUserPictureDOM, UserPictureDOM } from '../entities';
import { TUserPictureAPI, UserPictureAPI } from '../dto';

class UserPictureAdapters implements TAdapters<TUserPictureDOM, TUserPictureAPI> {
    apiToDom = (item: TUserPictureAPI): TUserPictureDOM => {
        return new UserPictureDOM({
            id: item._id,
            url: item.url,
        });
    };
    domToApi = (item: TUserPictureDOM): TUserPictureAPI => {
        return new UserPictureAPI({
            _id: item.id,
            url: item.url,
        });
    };
}

export const userPictureAdapters = new UserPictureAdapters();
