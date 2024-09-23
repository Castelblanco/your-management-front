import { ApiError } from '@common/errors/api_error';
import { useCallServices } from '@hooks/use_call_services';
import { statusCodeAdapters } from '@models/status_code/adapters';
import { TStatusCodeDOM, TStatusCodeType } from '@models/status_code/entities';
import {
    FormControl,
    FormControlProps,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Typography,
} from '@mui/material';
import { statusCodeServices } from '@services/status_code';
import { useSnackbar } from '@storages/zustand/snackbar';
import { useStatusCode } from '@storages/zustand/status_code';
import { useEffect } from 'react';

export type TDropDownStatusCodeProps = Omit<FormControlProps, 'onChange'> & {
    type: TStatusCodeType;
    onChange?: (status?: TStatusCodeDOM) => void;
    value?: string;
    showvoid?: boolean;
};

export const DropDownStatusCode = (props: TDropDownStatusCodeProps) => {
    const { statusCode, setStatusCode } = useStatusCode();
    const { setSnackbarError } = useSnackbar();

    const { loading, callEndpointList } = useCallServices();

    useEffect(() => {
        (async () => {
            try {
                if (statusCode[props.type].length !== 0) return;
                const { items } = await callEndpointList(
                    statusCodeServices.getAll(props.type),
                    statusCodeAdapters,
                );

                setStatusCode(props.type, items);
            } catch (e) {
                setSnackbarError(e as ApiError);
            }
        })();
    }, []);

    const handleChange = ({ target }: SelectChangeEvent) => {
        if (!props.onChange) return;
        if (!target.value) return props.onChange();
        props.onChange(statusCode[props.type].find((v) => v.id === target.value));
    };

    return (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <FormControl disabled={loading} {...(props as any)}>
            <InputLabel>Estado</InputLabel>
            <Select value={props.value} onChange={handleChange} label="Estado">
                {props.showvoid && (
                    <MenuItem value={''}>
                        <Typography
                            sx={{
                                opacity: 0,
                            }}
                        >
                            Ninguno
                        </Typography>
                    </MenuItem>
                )}
                {statusCode[props.type].map((code, i) => (
                    <MenuItem value={code.id} key={i}>
                        {code.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};
