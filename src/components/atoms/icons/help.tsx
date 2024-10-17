import { Help } from '@mui/icons-material';
import { SvgIconOwnProps } from '@mui/material';

export type TIconHelpProps = SvgIconOwnProps;
export const IconHelp = (props: TIconHelpProps) => {
    return <Help {...props} />;
};
