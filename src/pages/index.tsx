import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ROUTES } from '@constants/routes';
import { useProfile } from '@storages/zustand/profile';
import { lazy } from 'react';
import MainGuidesServiceCreate from './main/guides_service/create';
import MainGuidesServiceDetail from './main/guides_service/detail';

// ROUTES
const AuthRoutes = lazy(() => import('./auth'));
const AuthLogin = lazy(() => import('./auth/login'));
const MainRoutes = lazy(() => import('./main'));
const MainGuidesService = lazy(() => import('./main/guides_service'));
const MainClients = lazy(() => import('./main/clients'));
const MainUsers = lazy(() => import('./main/users'));
const MainPointsSales = lazy(() => import('./main/points_sale'));

export default function AppRoutes() {
    const { profile } = useProfile();

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    index
                    element={
                        profile.token ? (
                            <Navigate to={ROUTES.GUIDES_SERVICE} />
                        ) : (
                            <Navigate to={ROUTES.LOGIN} />
                        )
                    }
                />
                <Route path="auth" element={<AuthRoutes />}>
                    <Route path="login" element={<AuthLogin />} />
                </Route>
                <Route path="/" element={<MainRoutes />}>
                    <Route path={ROUTES.GUIDES_SERVICE} element={<MainGuidesService />} />
                    <Route
                        path={ROUTES.GUIDES_SERVICE_CREATE}
                        element={<MainGuidesServiceCreate />}
                    />
                    <Route
                        path={`${ROUTES.GUIDES_SERVICE}/:id`}
                        element={<MainGuidesServiceDetail />}
                    />
                    <Route path={ROUTES.POINTS_SALE} element={<MainPointsSales />} />
                    <Route path={ROUTES.USERS} element={<MainUsers />} />
                    <Route path={ROUTES.CLIENTS} element={<MainClients />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
