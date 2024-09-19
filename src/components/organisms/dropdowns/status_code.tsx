import { useCallServices } from '@hooks/use_call_services';
import { statusCodeAdapters } from '@models/status_code/adapters';
import { TStatusCodeType } from '@models/status_code/entities';
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
import { useStatusCode } from '@storages/zustand/status_code';
import { useEffect } from 'react';

export type TDropDownStatusCodeProps = Omit<FormControlProps, 'onChange'> & {
    type: TStatusCodeType;
    onChange?: (e: SelectChangeEvent) => void;
    value?: string;
    showvoid?: boolean;
};

export const DropDownStatusCode = (props: TDropDownStatusCodeProps) => {
    const { statusCode, setStatusCode } = useStatusCode();

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
                console.log({ e });
            }
        })();
    }, []);

    return (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <FormControl disabled={loading} {...(props as any)}>
            <InputLabel>Estado</InputLabel>
            <Select value={props.value} onChange={props.onChange} label="Estado">
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
