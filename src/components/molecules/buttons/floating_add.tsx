import { IconAdd } from '@atoms/icons/add';
import { ButtonSecondary, TButtonSecondaryProps } from './secondary';

export type TButtonFloatingAddProps = TButtonSecondaryProps;

export const ButtonFloatingAdd = (props: TButtonFloatingAddProps) => {
    return (
        <ButtonSecondary
            sx={{
                padding: 1.5,
                minWidth: 0,
                borderRadius: '50%',
                position: 'fixed',
                bottom: 30,
                right: 30,
                zIndex: 1000,
            }}
            {...props}
        >
            <IconAdd />
        </ButtonSecondary>
    );
};
