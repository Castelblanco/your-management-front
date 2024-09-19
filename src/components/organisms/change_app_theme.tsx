import { IconButton } from '@atoms/icon_button';
import { IconMoon } from '@atoms/icons/moon';
import { IconSun } from '@atoms/icons/sun';
import { useAppTheme } from 'storages/zustand/app_theme';

export const ChangeAppTheme = () => {
    const { mode, setSwitchMode } = useAppTheme();

    const toggleMode = () => setSwitchMode();

    return (
        <IconButton onClick={toggleMode} color="inherit">
            {mode == 'dark' ? <IconSun /> : <IconMoon />}
        </IconButton>
    );
};
