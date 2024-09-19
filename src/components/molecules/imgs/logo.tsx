import { TAppThemeMode } from '@storages/zustand/app_theme';

export type TLogoProps = {
    mode?: TAppThemeMode;
};

export const Logo = ({ mode }: TLogoProps) => {
    return (
        <img width={200} src={mode === 'light' ? '/logo-light.png' : '/logo-dark.png'} />
    );
};
