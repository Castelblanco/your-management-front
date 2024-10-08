import { ApiError } from '@common/errors/api_error';
import { STATUS_CODE } from '@constants/status_code';
import { useCallServices } from '@hooks/use_call_services';
import { naturalClientsAdapters } from '@models/clients/natural/adapters';
import {
    NaturalClientDOM,
    TNaturalClientDOM,
    TNaturalClientFilterDOM,
} from '@models/clients/natural/entities';
import { TStatusCodeDOM } from '@models/status_code/entities';
import { clientNaturalServices } from '@services/clients/natural';
import { useSnackbar } from '@storages/zustand/snackbar';
import { useStatusCode } from '@storages/zustand/status_code';
import { ChangeEvent, FormEvent, MouseEvent, useEffect, useState } from 'react';

const INITIAL_STATE_CLIENT = new NaturalClientDOM({
    id: '',
    numberMovil: '',
    address: '',
    documentId: '',
    firstName: '',
    lastName: '',
    natural: true,
});

export const useClientsNaturals = () => {
    const { setSnackbar, setSnackbarError } = useSnackbar();
    const { statusCode } = useStatusCode();

    const [clients, setClients] = useState<TNaturalClientDOM[]>([]);
    const [total, setTotal] = useState(1);
    const [offset, setOffset] = useState(0);
    const [limit, setLimit] = useState(10);
    const [statusCodeFilter, setStatusCodeFilter] = useState('');
    const [filters, setFilters] = useState<TNaturalClientFilterDOM>({
        limit: 0,
        offset: 0,
        firstName: '',
        lastName: '',
        address: '',
    });
    const [showDetail, setShowDetail] = useState(false);
    const [showCreate, setShowCreate] = useState(false);
    const [clientSelect, setClientSelect] = useState<TNaturalClientDOM>();
    const [clientCreate, setClientCreate] = useState(INITIAL_STATE_CLIENT);

    const { loading, callEndpointList, callEndpointApi } = useCallServices();

    useEffect(() => {
        getClients();
    }, [limit, offset, statusCodeFilter]);

    const getClients = async () => {
        try {
            const { items, total: totals } = await callEndpointList(
                clientNaturalServices.getAll({
                    ...filters,
                    limit,
                    offset: offset === 0 ? 0 : offset * limit,
                    status: true,
                    statusId: statusCodeFilter,
                }),
                naturalClientsAdapters,
            );
            setClients([...items]);
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
        if (target.name === 'address') {
            return setFilters({
                ...filters,
                address: target.value,
            });
        }
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        getClients();
    };

    const handleSelectClient = (client: TNaturalClientDOM) => {
        setClientSelect(client);
        toggleShowDetail();
    };

    const handleChangeStatusCodeClient = (status?: TStatusCodeDOM) => {
        if (!clientSelect) return;
        setClientSelect({
            ...clientSelect,
            status,
        });
    };

    const handleChangeClientEdit = ({ target }: ChangeEvent<HTMLInputElement>) => {
        if (!clientSelect) return;
        if (target.name === 'firstname') {
            return setClientSelect({
                ...clientSelect,
                firstName: target.value,
            });
        }
        if (target.name === 'lastname') {
            return setClientSelect({
                ...clientSelect,
                lastName: target.value,
            });
        }
        if (target.name === 'number_movil') {
            return setClientSelect({
                ...clientSelect,
                numberMovil: target.value,
            });
        }
        if (target.name === 'address') {
            return setClientSelect({
                ...clientSelect,
                address: target.value,
            });
        }
        if (target.name === 'document') {
            return setClientSelect({
                ...clientSelect,
                documentId: target.value,
            });
        }
    };

    const handleChangeClientCreate = ({ target }: ChangeEvent<HTMLInputElement>) => {
        if (target.name === 'firstname') {
            return setClientCreate({
                ...clientCreate,
                firstName: target.value,
            });
        }
        if (target.name === 'lastname') {
            return setClientCreate({
                ...clientCreate,
                lastName: target.value,
            });
        }
        if (target.name === 'number_movil') {
            return setClientCreate({
                ...clientCreate,
                numberMovil: target.value,
            });
        }
        if (target.name === 'address') {
            return setClientCreate({
                ...clientCreate,
                address: target.value,
            });
        }
        if (target.name === 'document') {
            return setClientCreate({
                ...clientCreate,
                documentId: target.value,
            });
        }
    };

    const handleCreateClient = async () => {
        try {
            const status = statusCode.clients.find(
                ({ name }) => name === STATUS_CODE.ACTIVE,
            )!;
            clientCreate.status = status;
            const newClient = await callEndpointApi(
                clientNaturalServices.createOne(clientCreate),
                naturalClientsAdapters,
            );
            if (clients.length >= limit) clients.pop();
            setClients([newClient, ...clients]);
            setClientCreate(INITIAL_STATE_CLIENT);
            toggleShowCreate();
            setSnackbar('Cliente Creado');
        } catch (e) {
            setSnackbarError(e as ApiError);
        }
    };

    const handleUpdateClient = async () => {
        try {
            if (!clientSelect) return;
            const clientUpdate = await callEndpointApi(
                clientNaturalServices.updateOne(clientSelect),
                naturalClientsAdapters,
            );

            const index = clients.findIndex((c) => c.id === clientUpdate.id);
            clients[index] = clientUpdate;
            setClients([...clients]);
            setSnackbar('Cliente Actualizado');
            toggleShowDetail();
        } catch (e) {
            setSnackbarError(e as ApiError);
        }
    };

    const toggleShowDetail = () => setShowDetail(!showDetail);
    const toggleShowCreate = () => setShowCreate(!showCreate);

    return {
        clients,
        total,
        offset,
        limit,
        statusCodeFilter,
        filters,
        showDetail,
        showCreate,
        clientSelect,
        clientCreate,
        loading,
        handleChangeLimit,
        handleChangeOffset,
        handleChangeStatusCodeFilter,
        handleChangeFilters,
        handleSubmit,
        handleSelectClient,
        handleChangeStatusCodeClient,
        handleChangeClientEdit,
        handleChangeClientCreate,
        handleCreateClient,
        handleUpdateClient,
        toggleShowDetail,
        toggleShowCreate,
    };
};
