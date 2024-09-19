import { Button, TButtonProps } from '@atoms/button';
import { LoadingCircular } from '@atoms/loadings/circular';

export type TButtonDefaultProps = TButtonProps & {
    loading?: boolean;
};

export const ButtonDefault = (props: TButtonDefaultProps) => {
    return (
        <Button variant="contained" disabled={props.loading || props.disabled} {...props}>
            {props.loading ? <LoadingCircular size={25} /> : props.children}
        </Button>
    );
};
