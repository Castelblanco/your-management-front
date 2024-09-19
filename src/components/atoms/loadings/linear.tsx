import { LinearProgress, LinearProgressProps } from '@mui/material';

export type TLoadingLinearProps = LinearProgressProps;
export const LoadingLinear = (props: TLoadingLinearProps) => {
    return <LinearProgress {...props} />;
};
