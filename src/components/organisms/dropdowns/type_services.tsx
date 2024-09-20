import { ApiError } from '@common/errors/api_error';
import { useCallServices } from '@hooks/use_call_services';
import { guideServiceTypeAdapter } from '@models/guides_service/adapters';
import {
    FormControl,
    FormControlProps,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Typography,
} from '@mui/material';
import { guideServices } from '@services/guides_service';
import { useSnackbar } from '@storages/zustand/snackbar';
import { useTypeServices } from '@storages/zustand/type_services';
import { useEffect } from 'react';

export type TDropDownTypeServicesPorps = Omit<FormControlProps, 'onChange'> & {
    onChange?: (e: SelectChangeEvent) => void;
    value?: string;
    showvoid?: boolean;
};

export const DropDownTypeServices = (props: TDropDownTypeServicesPorps) => {
    const { typeServices, setTypeServices } = useTypeServices();
    const { setSnackbarError } = useSnackbar();

    const { loading, callEndpointList } = useCallServices();

    useEffect(() => {
        (async () => {
            try {
                if (typeServices.length !== 0) return;
                const { items } = await callEndpointList(
                    guideServices.getServicesType(),
                    guideServiceTypeAdapter,
                );

                setTypeServices([...items]);
            } catch (e) {
                setSnackbarError(e as ApiError);
            }
        })();
    }, []);

    return (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <FormControl disabled={loading} {...(props as any)}>
            <InputLabel>Tipo de Servicio</InputLabel>
            <Select
                value={props.value}
                onChange={props.onChange}
                label="Tipo de Servicio"
            >
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
                {typeServices.map((code, i) => (
                    <MenuItem value={code.id} key={i}>
                        {code.tab}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};
