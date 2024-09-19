import { TUserLoginDOM } from '@models/users/entities';
import { useProfile } from '@storages/zustand/profile';
import { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

export const setInterceptors = (axios: AxiosInstance[]) => {
    let data: TUserLoginDOM = {
        id: '',
        firstName: '',
        lastName: '',
        documentId: '',
        email: '',
        phone: '',
        address: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        token: '',
    };

    useProfile.subscribe(({ profile }) => (data = profile));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onRequest = (request: InternalAxiosRequestConfig<any>) => {
        if (request.headers && data.token) request.headers.Authorization = data.token;
        return request;
    };

    axios.forEach((http) => {
        http.interceptors.request.use(onRequest);
    });
};
