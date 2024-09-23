import {
    Box,
    Card,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Toolbar,
    Typography,
} from '@mui/material';
import { useCallServices } from '@hooks/use_call_services';
import { LoadingLinear } from '@atoms/loadings/linear';
import { ChangeEvent, FormEvent, MouseEvent, useEffect, useState } from 'react';
import { TUserDOM, TUserFilterDOM } from '@models/users/entities';
import { userServices } from '@services/users';
import { userAdapters } from '@models/users/adapters';
import { Input } from '@atoms/input';
import { DropDownStatusCode } from '@organisms/dropdowns/status_code';
import { TStatusCodeDOM } from '@models/status_code/entities';
import { TUserRoleDOM } from '@models/user_roles/entities';
import { DropDownUserRoles } from '@organisms/dropdowns/user_roles';

import { ButtonFloatingAdd } from '@molecules/buttons/floating_add';
import { Modal } from '@organisms/modal';
import { FormUser } from '@templates/forms/user/index';

import styles from './styles.module.css';
import { TPointSaleDOM } from '@models/points_sale/entities';
import { useSnackbar } from '@storages/zustand/snackbar';
import { ApiError } from '@common/errors/api_error';

const INITIAL_STATE_USER: TUserDOM = {
    id: '',
    firstName: '',
    lastName: '',
    documentId: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    createdAt: new Date(),
    updatedAt: new Date(),
};

export default function MainUsers() {
    const { setSnackbarError, setSnackbar } = useSnackbar();

    const [users, setUsers] = useState<TUserDOM[]>([]);
    const [userSelect, setUserSelect] = useState<TUserDOM>();
    const [userCreate, setUserCreate] = useState<TUserDOM>(INITIAL_STATE_USER);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [statusCodeFilter, setStatusCodeFilter] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [filters, setFilters] = useState<TUserFilterDOM>({
        limit: 0,
        offset: 0,
        firstName: '',
        lastName: '',
        email: '',
        documentId: '',
    });
    const [total, setTotal] = useState(1);
    const [offset, setOffset] = useState(0);
    const [limit, setLimit] = useState(10);
    const [showCreate, setShowCreate] = useState(false);
    const [showDetail, setShowDetail] = useState(false);

    const { loading, callEndpointList, callEndpointApi } = useCallServices();

    useEffect(() => {
        getUsers();
    }, [offset, limit, statusCodeFilter, roleFilter]);

    const getUsers = async () => {
        try {
            const { items, total: totals } = await callEndpointList(
                userServices.getAll({
                    ...filters,
                    limit,
                    offset,
                    role: true,
                    status: true,
                    pointSale: true,
                    statusId: statusCodeFilter,
                    roleId: roleFilter,
                }),
                userAdapters,
            );
            setUsers([...items]);
            if (total !== totals) setTotal(totals);
        } catch (e) {
            console.log({ e });
        }
    };

    const handleChangeLimit = ({ target }: ChangeEvent<HTMLInputElement>) => {
        setLimit(+target.value);
    };

    const handleChangeOffset = (
        _: MouseEvent<HTMLButtonElement> | null,
        page: number,
    ) => {
        setOffset(page);
    };

    const handleChangeStatusCodeFilter = (status?: TStatusCodeDOM) => {
        setStatusCodeFilter(status?.id || '');
    };

    const handleChangeRoleFilter = (role?: TUserRoleDOM) => {
        setRoleFilter(role?.id || '');
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        getUsers();
    };

    const handleChangeFilters = ({ target }: ChangeEvent<HTMLInputElement>) => {
        if (target.name === 'firstname') {
            return setFilters({
                ...filters,
                firstName: target.value,
            });
        }
        if (target.name === 'lastname') {
            return setFilters({
                ...filters,
                lastName: target.value,
            });
        }
        if (target.name === 'email') {
            return setFilters({
                ...filters,
                email: target.value,
            });
        }
        if (target.name === 'document') {
            return setFilters({
                ...filters,
                documentId: target.value,
            });
        }
    };

    const handleChangeUserCreate = ({ target }: ChangeEvent<HTMLInputElement>) => {
        if (target.name === 'firstname') {
            return setUserCreate({
                ...userCreate,
                firstName: target.value,
            });
        }
        if (target.name === 'lastname') {
            return setUserCreate({
                ...userCreate,
                lastName: target.value,
            });
        }
        if (target.name === 'email') {
            return setUserCreate({
                ...userCreate,
                email: target.value,
            });
        }
        if (target.name === 'document') {
            return setUserCreate({
                ...userCreate,
                documentId: target.value,
            });
        }
        if (target.name === 'number_movil') {
            return setUserCreate({
                ...userCreate,
                phone: target.value,
            });
        }
        if (target.name === 'address') {
            return setUserCreate({
                ...userCreate,
                address: target.value,
            });
        }
        if (target.name === 'password') {
            return setUserCreate({
                ...userCreate,
                password: target.value,
            });
        }
        if (target.name === 'confirm_password') {
            return setConfirmPassword(target.value);
        }
    };

    const handleChangeUserCreatePointSale = (point: TPointSaleDOM) => {
        setUserCreate({
            ...userCreate,
            pointSale: point,
        });
    };

    const handleChangeUserCreateRole = (role?: TUserRoleDOM) => {
        setUserCreate({
            ...userCreate,
            role,
        });
    };

    const handleChangeUserCreateStatus = (status?: TStatusCodeDOM) => {
        setUserCreate({
            ...userCreate,
            status,
        });
    };

    const handleCreateUser = async () => {
        try {
            const newUser = await callEndpointApi(
                userServices.createOne(userCreate),
                userAdapters,
            );
            if (users.length >= limit) users.pop();
            setUsers([newUser, ...users]);
            setUserCreate(INITIAL_STATE_USER);
            setConfirmPassword('');
            toggleShowCreate();
            setSnackbar('Cliente Creado');
        } catch (e) {
            setSnackbarError(e as ApiError);
        }
    };

    const handleSelectUser = (user: TUserDOM) => {
        setUserSelect(user);
        toggleShowDetail();
    };

    const handleChangeUserEdit = ({ target }: ChangeEvent<HTMLInputElement>) => {
        if (!userSelect) return;

        if (target.name === 'firstname') {
            return setUserSelect({
                ...userSelect,
                firstName: target.value,
            });
        }
        if (target.name === 'lastname') {
            return setUserSelect({
                ...userSelect,
                lastName: target.value,
            });
        }
        if (target.name === 'email') {
            return setUserSelect({
                ...userSelect,
                email: target.value,
            });
        }
        if (target.name === 'document') {
            return setUserSelect({
                ...userSelect,
                documentId: target.value,
            });
        }
        if (target.name === 'number_movil') {
            return setUserSelect({
                ...userSelect,
                phone: target.value,
            });
        }
        if (target.name === 'address') {
            return setUserSelect({
                ...userSelect,
                address: target.value,
            });
        }
    };

    const handleChangeUserEditRole = (role?: TUserRoleDOM) => {
        if (!userSelect) return;
        setUserSelect({
            ...userSelect,
            role,
        });
    };

    const handleChangeUserEditStatus = (status?: TStatusCodeDOM) => {
        if (!userSelect) return;
        setUserSelect({
            ...userSelect,
            status,
        });
    };

    const handleUpdateUser = async () => {
        try {
            if (!userSelect) return;
            const updateUser = await callEndpointApi(
                userServices.updateOne(userSelect),
                userAdapters,
            );

            console.log({ updateUser, userSelect });

            const index = users.findIndex((c) => c.id === updateUser.id);
            users[index] = {
                ...updateUser,
                status: userSelect.status,
            };
            setUsers([...users]);
            toggleShowDetail();
            setSnackbar('Usuario Actualizado');
        } catch (e) {
            setSnackbarError(e as ApiError);
        }
    };

    const toggleShowCreate = () => setShowCreate(!showCreate);
    const toggleShowDetail = () => setShowDetail(!showDetail);

    return (
        <Box className={styles.container}>
            <ButtonFloatingAdd onClick={toggleShowCreate} />
            <Card className={styles.box_content}>
                <Toolbar>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <Input
                            className={styles.input}
                            name="firstname"
                            label="Nombre"
                            onChange={handleChangeFilters}
                        />
                        <Input
                            className={styles.input}
                            name="lastname"
                            label="Apellido"
                            onChange={handleChangeFilters}
                        />
                        <Input
                            className={styles.input}
                            name="email"
                            label="Correo"
                            onChange={handleChangeFilters}
                        />
                        <Input
                            className={styles.input}
                            name="document"
                            label="Documento"
                            onChange={handleChangeFilters}
                        />
                        <DropDownStatusCode
                            onChange={handleChangeStatusCodeFilter}
                            value={statusCodeFilter}
                            className={styles.input}
                            type="users"
                            showvoid
                        />
                        <DropDownUserRoles
                            onChange={handleChangeRoleFilter}
                            value={roleFilter}
                            className={styles.input}
                            showvoid
                        />
                        <input type="submit" hidden />
                    </form>
                </Toolbar>
                <TableContainer className={styles.table_container}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell className={styles.head_txt}>Nombre</TableCell>
                                <TableCell className={styles.head_txt}>
                                    Apellido
                                </TableCell>
                                <TableCell className={styles.head_txt}>
                                    Documento
                                </TableCell>
                                <TableCell className={styles.head_txt}>Correo</TableCell>
                                <TableCell className={styles.head_txt}>Rol</TableCell>
                                <TableCell className={styles.head_txt}>Estado</TableCell>
                            </TableRow>
                        </TableHead>
                        {loading && (
                            <TableBody>
                                <TableRow>
                                    <TableCell
                                        sx={{
                                            padding: 0,
                                        }}
                                        colSpan={14}
                                    >
                                        <LoadingLinear />
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        )}
                        <TableBody>
                            {users.map((user, i) => (
                                <TableRow
                                    onClick={() => handleSelectUser(user)}
                                    className={styles.column_body}
                                    hover
                                    key={i}
                                >
                                    <TableCell>{user.firstName}</TableCell>
                                    <TableCell>{user.lastName}</TableCell>
                                    <TableCell>{user.documentId}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.role?.name}</TableCell>
                                    <TableCell>{user.status?.name}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {users.length === 0 && !loading && (
                        <Typography className={styles.not_found_txt}>
                            Sin Resultados
                        </Typography>
                    )}
                </TableContainer>
                <TablePagination
                    count={total}
                    page={offset}
                    rowsPerPage={limit}
                    rowsPerPageOptions={[10, 50, 100]}
                    onPageChange={handleChangeOffset}
                    onRowsPerPageChange={handleChangeLimit}
                    component={'div'}
                    labelRowsPerPage="Usuario por pagina"
                />
            </Card>
            <Modal show={showDetail} onClose={toggleShowDetail}>
                <FormUser
                    title="Detalle"
                    user={userSelect}
                    loading={loading}
                    onChangeFirstName={handleChangeUserEdit}
                    onChangeLastName={handleChangeUserEdit}
                    onChangeEmail={handleChangeUserEdit}
                    onChangeDocument={handleChangeUserEdit}
                    onChangePhone={handleChangeUserEdit}
                    onChangeAddress={handleChangeUserEdit}
                    onChangeStatus={handleChangeUserEditStatus}
                    onChangeRole={handleChangeUserEditRole}
                    onUpdate={handleUpdateUser}
                    onCancel={toggleShowDetail}
                />
            </Modal>
            <Modal show={showCreate} onClose={toggleShowCreate}>
                <FormUser
                    title="Crear Usuario"
                    user={userCreate}
                    confirmPassword={confirmPassword}
                    loading={loading}
                    isCreate
                    onChangePointSale={handleChangeUserCreatePointSale}
                    onChangeFirstName={handleChangeUserCreate}
                    onChangeLastName={handleChangeUserCreate}
                    onChangeEmail={handleChangeUserCreate}
                    onChangeDocument={handleChangeUserCreate}
                    onChangePhone={handleChangeUserCreate}
                    onChangeAddress={handleChangeUserCreate}
                    onChangePassword={handleChangeUserCreate}
                    onChangeConfirmPassword={handleChangeUserCreate}
                    onChangeStatus={handleChangeUserCreateStatus}
                    onChangeRole={handleChangeUserCreateRole}
                    onCreate={handleCreateUser}
                    onCancel={toggleShowCreate}
                />
            </Modal>
        </Box>
    );
}
