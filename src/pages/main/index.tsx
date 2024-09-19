import { Header } from '@templates/header';
import { Menu } from '@templates/menu';
import { Outlet } from 'react-router-dom';

export default function MainRoutes() {
    return (
        <>
            <Header />
            <Menu />
            <Outlet />
        </>
    );
}
