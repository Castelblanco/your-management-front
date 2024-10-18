import { ApiError } from '@common/errors/api_error';

export const errorCancel = new ApiError({
    code: 0,
    message: 'Cancel',
});
