import { Menu } from '@mui/icons-material';
import { SvgIconOwnProps } from '@mui/material';

export type TIconMenuProps = SvgIconOwnProps;
export const IconMenu = (props: TIconMenuProps) => {
    return <Menu fontSize="medium" {...props} />;
};
