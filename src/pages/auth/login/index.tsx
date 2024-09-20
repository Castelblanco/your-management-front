import { Card, Typography } from '@mui/material';
import { Input } from '@atoms/input';
import { ButtonSecondary } from '@molecules/buttons/secondary';

import styles from './styles.module.css';
import { useCallServices } from '@hooks/use_call_services';
import { ChangeEvent, FormEvent, useState } from 'react';
import { userServices } from '@services/users';
import { usersLoginAdapters } from '@models/users/adapters';
import { useProfile } from '@storages/zustand/profile';
import { useSnackbar } from '@storages/zustand/snackbar';
import { ApiError } from '@common/errors/api_error';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@constants/routes';

export default function AuthLogin() {
    const { setProfile } = useProfile();
    const { setSnackbarError } = useSnackbar();

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { loading, callEndpointApi } = useCallServices();

    const handleChangeEmail = ({ target }: ChangeEvent<HTMLInputElement>) => {
        setEmail(target.value);
    };

    const handleChangePassword = ({ target }: ChangeEvent<HTMLInputElement>) => {
        setPassword(target.value);
    };

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const login = await callEndpointApi(
                userServices.login({
                    email,
                    password,
                }),
                usersLoginAdapters,
            );
            setProfile(login);
            navigate(ROUTES.GUIDES_SERVICE);
        } catch (e) {
            setSnackbarError(e as ApiError);
        }
    };

    return (
        <Card elevation={5} className={styles.container}>
            <Typography variant="h5">Iniciar Sesión</Typography>
            <form onSubmit={handleLogin} className={styles.form}>
                <Input
                    onChange={handleChangeEmail}
                    value={email}
                    fullWidth
                    type="email"
                    name="email"
                    label="Correo Electrónico"
                />
                <span className={styles.separator} />
                <Input
                    onChange={handleChangePassword}
                    value={password}
                    fullWidth
                    type="password"
                    label="Contraseña"
                />
                <span className={styles.separator} />
                <ButtonSecondary loading={loading} type="submit" fullWidth>
                    Iniciar Sesión
                </ButtonSecondary>
            </form>
        </Card>
    );
}
