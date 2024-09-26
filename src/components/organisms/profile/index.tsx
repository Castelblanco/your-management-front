import { Button } from '@atoms/button';
import { ButtonEdit } from '@molecules/buttons/edit';
import {
    Box,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Divider,
    Menu,
    MenuItem,
    Stack,
    Typography,
} from '@mui/material';
import { useProfile } from '@storages/zustand/profile';
import { ChangeEvent, MouseEvent, useRef, useState } from 'react';
import { Cropper, ReactCropperElement } from 'react-cropper';
import { ButtonSecondary } from '@molecules/buttons/secondary';
import { Modal } from '@organisms/modal';
import 'cropperjs/dist/cropper.css';
import styles from './styles.module.css';
import { useSnackbar } from '@storages/zustand/snackbar';
import { ApiError } from '@common/errors/api_error';
import { useCallServices } from '@hooks/use_call_services';
import { userServices } from '@services/users';
import { userPictureAdapters } from '@models/users/adapters/picture';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@constants/routes';

export const Profile = () => {
    const { profile, setProfile, clearProfile } = useProfile();
    const { setSnackbarError, setSnackbar } = useSnackbar();

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [imageSelectUri, setImageSelectUri] = useState('');
    const [showEdit, setShowEdit] = useState(false);

    const inputFileRef = useRef<HTMLInputElement>(null);
    const cropperRef = useRef<ReactCropperElement>(null);

    const navigate = useNavigate();
    const { loading, callEndpointApi } = useCallServices();

    const handleOpenMenu = ({ currentTarget }: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(currentTarget);
    };

    const handleCloseMenu = () => setAnchorEl(null);

    const handleClickEdit = () => {
        inputFileRef.current?.click();
    };

    const handleSignOut = () => {
        clearProfile();
        navigate(ROUTES.LOGIN);
    };

    const handleChangeInputFile = ({ target }: ChangeEvent<HTMLInputElement>) => {
        const reader = new FileReader();
        reader.readAsDataURL(target.files![0]);
        reader.onload = ({ currentTarget }) => {
            if (!currentTarget) return;
            setImageSelectUri(`${(currentTarget as FileReader).result}`);
            toggleShowEdit();
        };
    };

    const handleChangeProfilePicture = async () => {
        try {
            if (!cropperRef.current) return;
            const url = cropperRef.current.cropper
                .getCroppedCanvas()
                .toDataURL('image/png');

            const picture = await callEndpointApi(
                userServices.updatePicture(profile.id, {
                    id: profile.picture?.id || '',
                    url,
                }),
                userPictureAdapters,
            );
            setProfile({
                ...profile,
                picture,
            });
            toggleShowEdit();
            setSnackbar('Perfil Actualizado');
        } catch (e) {
            setSnackbarError(e as ApiError);
        }
    };

    const handleCancelEdit = () => {
        if (!inputFileRef.current) return;
        inputFileRef.current.value = '';
        toggleShowEdit();
    };
    const toggleShowEdit = () => setShowEdit(!showEdit);

    return (
        <Box>
            <Button className={styles.btn_img} onClick={handleOpenMenu}>
                {profile.picture?.url ? (
                    <img className={styles.img} width={40} src={profile.picture?.url} />
                ) : (
                    <img className={styles.img} width={40} src="/user-default.png" />
                )}
            </Button>
            <Menu
                open={!!anchorEl}
                anchorEl={anchorEl}
                anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                onClose={handleCloseMenu}
            >
                <Box padding={1}>
                    <Stack alignItems={'center'} position={'relative'}>
                        {profile.picture?.url ? (
                            <img
                                className={styles.img_profile}
                                width={100}
                                src={profile.picture?.url}
                            />
                        ) : (
                            <img
                                className={styles.img_profile}
                                width={100}
                                src="/user-default.png"
                            />
                        )}
                        <Box position={'absolute'} bottom={5} right={40}>
                            <ButtonEdit
                                className={styles.btn_edit}
                                onClick={handleClickEdit}
                            />
                        </Box>
                        <input
                            type="file"
                            name="picture"
                            id="picture_id"
                            accept="image/*"
                            ref={inputFileRef}
                            onChange={handleChangeInputFile}
                            hidden
                        />
                    </Stack>
                    <Typography variant="h6">
                        {profile.firstName} {profile.lastName}
                    </Typography>
                    <Typography>{profile.pointSale?.name}</Typography>
                </Box>
                <Divider />
                <MenuItem onClick={handleSignOut}>Cerrar Sesión</MenuItem>
            </Menu>
            {imageSelectUri && (
                <Modal show={showEdit} onClose={handleCancelEdit}>
                    <Card>
                        <CardHeader title="Adaptando Foto" />
                        <CardContent>
                            <Cropper
                                ref={cropperRef}
                                src={imageSelectUri}
                                style={{ width: '100%', height: 300 }}
                                initialAspectRatio={1}
                                autoCropArea={0}
                                aspectRatio={1}
                                viewMode={3}
                                guides={false}
                                cropBoxResizable={false}
                                movable={false}
                                dragMode="move"
                                highlight={false}
                                data={{
                                    width: 282,
                                    height: 282,
                                    scaleX: 1,
                                    scaleY: 1,
                                }}
                                minCropBoxWidth={1000000}
                                minCropBoxHeight={1000000}
                                responsive
                            />
                        </CardContent>
                        <CardActions>
                            <ButtonSecondary
                                loading={loading}
                                onClick={handleChangeProfilePicture}
                            >
                                Guardar
                            </ButtonSecondary>
                            <ButtonSecondary onClick={handleCancelEdit}>
                                Cancelar
                            </ButtonSecondary>
                        </CardActions>
                    </Card>
                </Modal>
            )}
        </Box>
    );
};
