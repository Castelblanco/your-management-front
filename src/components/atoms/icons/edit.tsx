import { Edit } from '@mui/icons-material';
import { SvgIconOwnProps } from '@mui/material';

export type TIconEditProps = SvgIconOwnProps;
export const IconEdit = (props: TIconEditProps) => {
    return <Edit {...props} />;
};
