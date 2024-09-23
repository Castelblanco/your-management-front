import { ButtonSecondary, TButtonSecondaryProps } from './secondary';
import { IconMoney } from '@atoms/icons/money';

export type TButtonFloatingLiquidationProps = TButtonSecondaryProps;

export const ButtonFloatingLiquidation = (props: TButtonFloatingLiquidationProps) => {
    return (
        <ButtonSecondary
            sx={{
                padding: 1.5,
                minWidth: 0,
                borderRadius: '50%',
                position: 'fixed',
                bottom: 90,
                right: 30,
                zIndex: 1000,
            }}
            {...props}
        >
            <IconMoney />
        </ButtonSecondary>
    );
};
