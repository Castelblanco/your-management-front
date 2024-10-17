import { Box, Tooltip } from '@mui/material';
import { ButtonSecondary, TButtonSecondaryProps } from './secondary';
import { IconEdit } from '@atoms/icons/edit';

export type TButtonEditProps = TButtonSecondaryProps;
export const ButtonEdit = (props: TButtonEditProps) => {
    return (
        <Tooltip title={props.tooltip}>
            <Box>
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
