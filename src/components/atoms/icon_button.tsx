import { IconButton as IconBtn, IconButtonOwnProps } from '@mui/material';
import { DOMAttributes } from 'react';

export type TIconButtonProps = DOMAttributes<HTMLButtonElement> & IconButtonOwnProps;

export const IconButton = (props: TIconButtonProps) => {
    return <IconBtn {...props} />;
};
