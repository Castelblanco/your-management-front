import { ButtonSecondary, TButtonSecondaryProps } from './secondary';
import { IconEdit } from '@atoms/icons/edit';

export type TButtonEditProps = TButtonSecondaryProps;
export const ButtonEdit = (props: TButtonEditProps) => {
    return (
        <ButtonSecondary
            sx={{
                padding: 1.5,
                minWidth: 0,
                borderRadius: '50%',
            }}
            {...props}
        >
            <IconEdit />
        </ButtonSecondary>
    );
};
