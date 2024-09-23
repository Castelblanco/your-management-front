import { ROUTES } from '@constants/routes';
import { Logo } from '@molecules/imgs/logo';
import { Box, Drawer, List, ListItemButton, ListItemText } from '@mui/material';
import { useAppTheme } from '@storages/zustand/app_theme';
import { useEffect, useState } from 'react';
import styles from './styles.module.css';
import { IconButton } from '@atoms/icon_button';
import { IconMenu } from '@atoms/icons/menu';
import { useMenu } from '@storages/zustand/menu';
import { useLocation, useNavigate } from 'react-router-dom';

type TNavigator = {
    label: string;
    href: ROUTES;
    activated: boolean;
};

const NAVIGATORS: TNavigator[] = [
    {
        href: ROUTES.GUIDES_SERVICE,
        activated: false,
        label: 'Guias de Servicio',
    },
    {
        href: ROUTES.POINTS_SALE,
        activated: false,
        label: 'Puntos de Venta',
    },
    {
        href: ROUTES.USERS,
        activated: false,
        label: 'Usuarios',
    },
    {
        href: ROUTES.CLIENTS,
        activated: false,
        label: 'Clientes',
    },
];

export const Menu = () => {
    const { mode } = useAppTheme();
    const { show, toggleShow } = useMenu();

    const location = useLocation();
    const navigator = useNavigate();

    const [navigators, setNavigators] = useState(NAVIGATORS);

    useEffect(() => {
        const navs = navigators.map((nav) => {
            if (location.pathname === nav.href) nav.activated = true;
            else nav.activated = false;
            return nav;
        });
        setNavigators([...navs]);
    }, []);

    const handleSelectNav = (index: number) => {
        const navs = navigators.map((nav, i) => {
            if (i === index) nav.activated = true;
            else nav.activated = false;
            return nav;
        });

        navigator(navs[index].href);
        setNavigators([...navs]);
        toggleShowMenu();
    };

    const toggleShowMenu = () => toggleShow();

    return (
        <Drawer
            open={show}
            PaperProps={{
                elevation: 5,
                className: styles.container,
            }}
            onClose={toggleShowMenu}
        >
            <Box className={styles.box_header}>
                <IconButton
                    sx={{
                        marginRight: 2,
                    }}
                    color="inherit"
                    onClick={toggleShowMenu}
                >
                    <IconMenu />
                </IconButton>
                <Logo mode={mode} />
            </Box>
            <List>
                {navigators.map((nav, i) => (
                    <ListItemButton
                        className={styles.btn_nav}
                        selected={nav.activated}
                        onClick={() => handleSelectNav(i)}
                        key={i}
                    >
                        <ListItemText primary={nav.label} />
                    </ListItemButton>
                ))}
            </List>
        </Drawer>
    );
};
