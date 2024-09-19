import { Delete } from '@mui/icons-material';
import { SvgIconOwnProps } from '@mui/material';

export type TIconDeleteProps = SvgIconOwnProps;
export const IconDelete = (props: TIconDeleteProps) => {
    return <Delete {...props} />;
};
