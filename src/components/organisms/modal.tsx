import { Box, Modal as MD } from '@mui/material';
import { ReactNode } from 'react';

export type TModalProps = {
    show: boolean;
    onClose: () => void;
    children: ReactNode;
};

export const Modal = (props: TModalProps) => {
    return (
        <MD open={props.show} onClose={props.onClose}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%',
                }}
            >
                {props.children}
            </Box>
        </MD>
    );
};
