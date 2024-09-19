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
import { useEffect } from 'react';

export type TDropDownNoveltiesProps = Omit<FormControlProps, 'onChange'> & {
    onChange?: (e: SelectChangeEvent) => void;
    value?: string;
    showvoid?: boolean;
};

export const DropDownNovelties = (props: TDropDownNoveltiesProps) => {
    const { novelties, setNovelties } = useNovelties();

    useEffect(() => {
        (async () => {
            try {
                if (novelties.length !== 0) return;
                const { data } = await guideServices.getNolveties().response;

                setNovelties(
                    data.items.map((type) => ({
                        id: type._id,
                        name: type.name,
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
