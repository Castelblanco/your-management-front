import { IconDelete } from '@atoms/icons/delete';
import { ButtonSecondary, TButtonSecondaryProps } from './secondary';
import { Box, Tooltip } from '@mui/material';

export type TButtonDeleteProps = TButtonSecondaryProps;

export const ButtonDelete = (props: TButtonDeleteProps) => {
    return (
        <Tooltip title={props.tooltip}>
            <Box>
                <ButtonSecondary
                    sx={{
                        minWidth: 0,
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                    }}
                    {...props}
                >
                    <IconDelete />
                </ButtonSecondary>
            </Box>
        </Tooltip>
    );
};
