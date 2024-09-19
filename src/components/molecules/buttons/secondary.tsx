import { ButtonDefault, TButtonDefaultProps } from './default';

export type TButtonSecondaryProps = TButtonDefaultProps;
export const ButtonSecondary = (props: TButtonSecondaryProps) => {
    return <ButtonDefault {...props} color="secondary" variant="contained" />;
};
