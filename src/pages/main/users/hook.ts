import { ApiError } from '@common/errors/api_error';
import { useCallServices } from '@hooks/use_call_services';
import { TPointSaleDOM } from '@models/points_sale/entities';
import { TStatusCodeDOM } from '@models/status_code/entities';
import { userAdapters } from '@models/users/adapters';
import { TUserDOM, TUserFilterDOM, TUserRoleDOM } from '@models/users/entities';
import { userServices } from '@services/users';
import { useSnackbar } from '@storages/zustand/snackbar';
import { ChangeEvent, FormEvent, MouseEvent, useEffect, useState } from 'react';

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

export const useMainUsers = () => {
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
                    offset: offset === 0 ? 0 : offset * limit,
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
            setSnackbarError(e as ApiError);
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

    return {
        users,
        userSelect,
        userCreate,
        confirmPassword,
        statusCodeFilter,
        roleFilter,
        filters,
        total,
        offset,
        limit,
        showCreate,
        showDetail,
        loading,
        handleChangeLimit,
        handleChangeOffset,
        handleChangeStatusCodeFilter,
        handleChangeRoleFilter,
        handleSubmit,
        handleChangeFilters,
        handleChangeUserCreate,
        handleChangeUserCreatePointSale,
        handleChangeUserCreateRole,
        handleChangeUserCreateStatus,
        handleCreateUser,
        handleSelectUser,
        handleChangeUserEdit,
        handleChangeUserEditRole,
        handleChangeUserEditStatus,
        handleUpdateUser,
        toggleShowCreate,
        toggleShowDetail,
    };
};
