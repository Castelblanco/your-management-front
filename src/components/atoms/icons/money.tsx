import { AttachMoney } from '@mui/icons-material';
import { SvgIconOwnProps } from '@mui/material';

export type TIconMoneyProps = SvgIconOwnProps;
export const IconMoney = (props: TIconMoneyProps) => {
    return <AttachMoney {...props} />;
};
