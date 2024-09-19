import { TextField, TextFieldProps } from '@mui/material';

export type TInputProps = TextFieldProps;

export const Input = (props: TInputProps) => {
    return <TextField spellCheck={false} {...props} />;
};
