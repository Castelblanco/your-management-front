import { LightMode } from '@mui/icons-material';
import { SvgIconOwnProps } from '@mui/material';

export type TIconSunProps = SvgIconOwnProps;
export const IconSun = (props: TIconSunProps) => {
    return <LightMode fontSize="medium" {...props} />;
};
