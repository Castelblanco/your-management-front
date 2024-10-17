import { IconButton as IconBtn, IconButtonOwnProps } from '@mui/material';
import { DOMAttributes } from 'react';

export type TIconButtonProps = DOMAttributes<HTMLButtonElement> &
    IconButtonOwnProps & {
        tooltip: string;
    };

export const IconButton = (props: TIconButtonProps) => {
    return <IconBtn {...props} />;
};
