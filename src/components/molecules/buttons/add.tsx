import { IconAdd } from '@atoms/icons/add';
import { ButtonSecondary, TButtonSecondaryProps } from './secondary';

export type TButtonAddProps = TButtonSecondaryProps;

export const ButtonAdd = (props: TButtonAddProps) => {
    return (
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
    );
};
