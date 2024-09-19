import { ButtonDefault, TButtonDefaultProps } from './default';

export type TButtonPrimaryProps = TButtonDefaultProps;
export const ButtonPrimary = (props: TButtonPrimaryProps) => {
    return <ButtonDefault {...props} color="primary" variant="contained" />;
};
