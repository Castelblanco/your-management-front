import { IconAdd } from '@atoms/icons/add';
import { ButtonSecondary, TButtonSecondaryProps } from './secondary';
import { Box, Tooltip } from '@mui/material';

export type TButtonFloatingAddProps = TButtonSecondaryProps;
export const ButtonFloatingAdd = (props: TButtonFloatingAddProps) => {
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
                    <IconAdd />
                </ButtonSecondary>
            </Box>
        </Tooltip>
    );
};
