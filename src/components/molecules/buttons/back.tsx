import { Box, Tooltip } from '@mui/material';
import { ButtonSecondary, TButtonSecondaryProps } from './secondary';
import { IconArrowBack } from '@atoms/icons/arrow_back';

export type TButtonBackProps = TButtonSecondaryProps;

export const ButtonBack = (props: TButtonBackProps) => {
    return (
        <Tooltip title={props.tooltip}>
            <Box
                sx={{
                    width: 'fit-content',
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
                    <IconArrowBack />
                </ButtonSecondary>
            </Box>
        </Tooltip>
    );
};
