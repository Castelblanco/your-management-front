import { DarkMode } from '@mui/icons-material';
import { SvgIconOwnProps } from '@mui/material';

export type TIconMoonProps = SvgIconOwnProps;
export const IconMoon = (props: TIconMoonProps) => {
    return <DarkMode fontSize="medium" {...props} />;
};
