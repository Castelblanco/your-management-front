import { IconMenu } from '@atoms/icons/menu';
import { Box, Tooltip } from '@mui/material';
import { IconButton, TIconButtonProps } from '@atoms/icon_button';

export type TButtonMenuProps = TIconButtonProps;
export const ButtonMenu = (props: TButtonMenuProps) => {
    return (
        <Tooltip title={props.tooltip}>
            <Box
                sx={{
                    minWidth: 0,
                    width: 50,
                    borderRadius: '50%',
                }}
            >
                <IconButton {...props} color="inherit">
                    <IconMenu />
                </IconButton>
            </Box>
        </Tooltip>
    );
};
