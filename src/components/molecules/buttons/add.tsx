import { IconAdd } from '@atoms/icons/add';
import { ButtonSecondary, TButtonSecondaryProps } from './secondary';
import { Box, Tooltip } from '@mui/material';

export type TButtonAddProps = TButtonSecondaryProps;
export const ButtonAdd = (props: TButtonAddProps) => {
    return (
        <Tooltip title={props.tooltip} placement="top">
            <Box
                sx={{
                    minWidth: 0,
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                }}
            >
                <ButtonSecondary
                    sx={{
                        minWidth: 0,
                        width: 50,
                        height: 50,
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
