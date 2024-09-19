import { Add } from '@mui/icons-material';
import { SvgIconOwnProps } from '@mui/material';

export type TIconAddProps = SvgIconOwnProps;
export const IconAdd = (props: TIconAddProps) => {
    return <Add {...props} />;
};
