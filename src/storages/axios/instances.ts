import { SERVICES_URL } from '@constants/services';
import axios from 'axios';
import { setInterceptors } from './interceptor';

export const httpMonolith = axios.create({
    baseURL: SERVICES_URL.MONOLITH,
});

export const executeIntersectorInInstaces = () => {
    setInterceptors([httpMonolith]);
};
