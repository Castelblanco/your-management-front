import { Box, Tooltip } from '@mui/material';
import { ButtonSecondary, TButtonSecondaryProps } from './secondary';
import { IconMoney } from '@atoms/icons/money';

export type TButtonFloatingLiquidationProps = TButtonSecondaryProps;

export const ButtonFloatingLiquidation = (props: TButtonFloatingLiquidationProps) => {
    return (
        <Tooltip title={props.tooltip}>
            <Box
                sx={{
                    position: 'fixed',
                    bottom: 90,
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
                    <IconMoney />
                </ButtonSecondary>
            </Box>
        </Tooltip>
    );
};
