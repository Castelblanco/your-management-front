import { ApiError } from '@common/errors/api_error';
import { useCallServices } from '@hooks/use_call_services';
import { statusCodeAdapters } from '@models/status_code/adapters';
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
import { useNovelties } from '@storages/zustand/novelties';
import { useSnackbar } from '@storages/zustand/snackbar';
import { useEffect } from 'react';

export type TDropDownNoveltiesProps = Omit<FormControlProps, 'onChange'> & {
    onChange?: (e: SelectChangeEvent) => void;
    value?: string;
    showvoid?: boolean;
};

export const DropDownNovelties = (props: TDropDownNoveltiesProps) => {
    const { novelties, setNovelties } = useNovelties();
    const { setSnackbarError } = useSnackbar();

    const { loading, callEndpointList } = useCallServices();

    useEffect(() => {
        (async () => {
            try {
                if (novelties.length !== 0) return;
                const { items } = await callEndpointList(
                    guideServices.getNolveties(),
                    statusCodeAdapters,
                );

                setNovelties([...items]);
            } catch (e) {
                setSnackbarError(e as ApiError);
            }
        })();
    }, []);

    return (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <FormControl disabled={loading} {...(props as any)}>
            <InputLabel>Novedad</InputLabel>
            <Select value={props.value} onChange={props.onChange} label="Novedad">
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
                {novelties.map((code, i) => (
                    <MenuItem value={code.id} key={i}>
                        {code.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};
