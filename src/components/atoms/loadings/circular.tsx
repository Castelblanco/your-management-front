import { CircularProgress, CircularProgressProps } from '@mui/material';

export type TLoadingCircularProps = CircularProgressProps;
export const LoadingCircular = (props: TLoadingCircularProps) => {
    return <CircularProgress {...props} />;
};
