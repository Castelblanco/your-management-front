import { ArrowBack } from '@mui/icons-material';
import { SvgIconOwnProps } from '@mui/material';

export type TIconArrowBackProps = SvgIconOwnProps;
export const IconArrowBack = (props: TIconArrowBackProps) => {
    return <ArrowBack {...props} />;
};
