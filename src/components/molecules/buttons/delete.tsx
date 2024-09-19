import { IconDelete } from '@atoms/icons/delete';
import { ButtonSecondary, TButtonSecondaryProps } from './secondary';

export type TButtonDeleteProps = TButtonSecondaryProps;

export const ButtonDelete = (props: TButtonDeleteProps) => {
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
            <IconDelete />
        </ButtonSecondary>
    );
};
