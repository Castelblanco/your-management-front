import { Box, Paper, Stack, Typography } from '@mui/material';
import styles from './styles.module.css';
import { APP_VERSION } from '@constants/app';
import { ChangeAppTheme } from '@organisms/change_app_theme';
import { Logo } from '@molecules/imgs/logo';
import { useMenu } from '@storages/zustand/menu';
import { useAppTheme } from '@storages/zustand/app_theme';
import { Profile } from '@organisms/profile/index';
import { ButtonHelp } from '@molecules/buttons/help';
import { ButtonMenu } from '@molecules/buttons/menu';

export const Header = () => {
    const { mode } = useAppTheme();
    const { toggleShow } = useMenu();
    const toggleShowMenu = () => toggleShow();

    const handleHelp = () => open(`/manual%20de%20usuario.pdf`);

    return (
        <Paper
            sx={{
                backgroundColor: mode === 'dark' ? '#212121' : '#b71c1c',
            }}
            elevation={5}
            square
            className={styles.container}
            color="Highlight"
        >
            <Box className={styles.box_menu_app_version}>
                <ButtonMenu
                    onClick={toggleShowMenu}
                    sx={{
                        marginRight: 2,
                    }}
                    tooltip="Menu"
                />
                <Logo />
                <Typography
                    sx={{
                        marginLeft: 2,
                    }}
                >
                    v{APP_VERSION}
                </Typography>
            </Box>
            <Stack
                flexDirection={'row'}
                alignItems={'center'}
                justifyContent={'space-between'}
                width={'150px'}
            >
                <ButtonHelp tooltip="Ayuda" onClick={handleHelp} />
                <ChangeAppTheme />
                <Profile />
            </Stack>
        </Paper>
    );
};
