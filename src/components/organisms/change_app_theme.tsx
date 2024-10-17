import { IconButton } from '@atoms/icon_button';
import { IconMoon } from '@atoms/icons/moon';
import { IconSun } from '@atoms/icons/sun';
import { Box, Tooltip } from '@mui/material';
import { useAppTheme } from 'storages/zustand/app_theme';

export const ChangeAppTheme = () => {
    const { mode, setSwitchMode } = useAppTheme();
    const toggleMode = () => setSwitchMode();
    return (
        <Tooltip title={mode === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}>
            <Box>
                <IconButton tooltip="" onClick={toggleMode} color="inherit">
                    {mode == 'dark' ? <IconSun /> : <IconMoon />}
                </IconButton>
            </Box>
        </Tooltip>
    );
};
