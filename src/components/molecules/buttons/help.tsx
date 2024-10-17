import { IconButton, TIconButtonProps } from '@atoms/icon_button';
import { IconHelp } from '@atoms/icons/help';
import { Box, Tooltip } from '@mui/material';

export type TButtonHelpProps = TIconButtonProps;

export const ButtonHelp = (props: TButtonHelpProps) => {
    return (
        <Tooltip title={props.tooltip}>
            <Box>
                <IconButton {...props} color="inherit">
                    <IconHelp />
                </IconButton>
            </Box>
        </Tooltip>
    );
};
