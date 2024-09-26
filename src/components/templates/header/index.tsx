import { Box, Paper, Stack, Typography } from '@mui/material';
import styles from './styles.module.css';
import { IconButton } from '@atoms/icon_button';
import { IconMenu } from '@atoms/icons/menu';
import { APP_VERSION } from '@constants/app';
import { ChangeAppTheme } from '@organisms/change_app_theme';
import { Logo } from '@molecules/imgs/logo';
import { useMenu } from '@storages/zustand/menu';
import { useAppTheme } from '@storages/zustand/app_theme';
import { Profile } from '@organisms/profile/index';

export const Header = () => {
    const { mode } = useAppTheme();
    const { toggleShow } = useMenu();
    const toggleShowMenu = () => toggleShow();

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
                <IconButton
                    sx={{
                        marginRight: 2,
                    }}
                    color="inherit"
                    onClick={toggleShowMenu}
                >
                    <IconMenu />
                </IconButton>
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
                width={'100px'}
            >
                <ChangeAppTheme />
                <Profile />
            </Stack>
        </Paper>
    );
};
