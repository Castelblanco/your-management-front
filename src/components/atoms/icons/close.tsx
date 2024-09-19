import { Close } from '@mui/icons-material';
import { SvgIconOwnProps } from '@mui/material';

export type TIconMenuProps = SvgIconOwnProps;
export const IconClose = (props: TIconMenuProps) => {
    return <Close {...props} />;
};
