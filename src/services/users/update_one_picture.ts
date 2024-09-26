import type { ApiResponses } from '@common/responses/api_response';
import { UserPictureAPI, type TUserPictureAPI } from '@models/users/dto';
import type { TUserPictureDOM } from '@models/users/entities';
import { PATH, type Dependencies } from '.';

export const buildUpdateOnePicture = ({
    abortController,
    http,
    dataURItoBlob,
}: Dependencies) => {
    const service = (id: string, picture: TUserPictureDOM) => {
        const controller = abortController();
        const pictureApi = new UserPictureAPI({
            _id: picture.id,
            url: picture.url,
        });

        return {
            response: http.patch<ApiResponses<TUserPictureAPI>>(
                `${PATH}/update-one/${id}/picture`,
                {
                    ...pictureApi,
                    ...{ file: dataURItoBlob(pictureApi.url) },
                },
                {
                    signal: controller.signal,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                },
            ),
            controller,
        };
    };

    return service;
};
