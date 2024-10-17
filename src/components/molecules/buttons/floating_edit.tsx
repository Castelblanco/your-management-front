import { Box, Tooltip } from '@mui/material';
import { ButtonSecondary, TButtonSecondaryProps } from './secondary';
import { IconEdit } from '@atoms/icons/edit';

export type TButtonFloatingEditProps = TButtonSecondaryProps;

export const ButtonFloatingEdit = (props: TButtonFloatingEditProps) => {
    return (
        <Tooltip title={props.tooltip}>
            <Box
                sx={{
                    position: 'fixed',
                    bottom: 30,
                    right: 30,
                    zIndex: 1000,
                }}
            >
                <ButtonSecondary
                    sx={{
                        padding: 1.5,
                        minWidth: 0,
                        borderRadius: '50%',
                    }}
                    {...props}
                >
                    <IconEdit />
                </ButtonSecondary>
            </Box>
        </Tooltip>
    );
};
