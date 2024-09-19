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
import { useTypeServices } from '@storages/zustand/type_services';
import { useEffect } from 'react';

export type TDropDownTypeServicesPorps = Omit<FormControlProps, 'onChange'> & {
    onChange?: (e: SelectChangeEvent) => void;
    value?: string;
    showvoid?: boolean;
};

export const DropDownTypeServices = (props: TDropDownTypeServicesPorps) => {
    const { typeServices, setTypeServices } = useTypeServices();

    useEffect(() => {
        (async () => {
            try {
                if (typeServices.length !== 0) return;
                const { data } = await guideServices.getServicesType().response;

                setTypeServices(
                    data.items.map((type) => ({
                        id: type._id,
                        name: type.name,
                        tab: type.tab,
                    })),
                );
            } catch (e) {
                console.log({ e });
            }
        })();
    }, []);

    return (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <FormControl {...(props as any)}>
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
