import { useCallServices } from '@hooks/use_call_services';
import { userRolesAdapters } from '@models/user_roles/adapters';
import { TUserRoleDOM } from '@models/users/entities';
import {
    FormControl,
    FormControlProps,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Typography,
} from '@mui/material';
import { userRoleServices } from '@services/user_roles';
import { useUserRoles } from '@storages/zustand/user_roles';
import { useEffect } from 'react';

export type TDropDownUserRolesProps = Omit<FormControlProps, 'onChange'> & {
    onChange?: (role?: TUserRoleDOM) => void;
    value?: string;
    showvoid?: boolean;
};

export const DropDownUserRoles = (props: TDropDownUserRolesProps) => {
    const { roles, setRoles } = useUserRoles();

    const { loading, callEndpointList } = useCallServices();

    useEffect(() => {
        (async () => {
            try {
                if (roles.length > 0) return;
                const { items } = await callEndpointList(
                    userRoleServices.getAll(),
                    userRolesAdapters,
                );
                setRoles([...items]);
            } catch (e) {
                console.log({ e });
            }
        })();
    }, []);

    const handleChange = ({ target }: SelectChangeEvent) => {
        if (!props.onChange) return;
        if (!target.value) return props.onChange();
        props.onChange(roles.find((v) => v.id === target.value));
    };

    return (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <FormControl disabled={loading} {...(props as any)}>
            <InputLabel>Role</InputLabel>
            <Select value={props.value} onChange={handleChange} label="Role">
                {props.showvoid && (
                    <MenuItem value={''}>
                        <Typography sx={{ opacity: 0 }}>Ninguno</Typography>
                    </MenuItem>
                )}
                {roles.map((role, i) => (
                    <MenuItem value={role.id} key={i}>
                        {role.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};
