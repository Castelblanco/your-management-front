import { ApiError } from '@common/errors/api_error';
import { STATUS_CODE } from '@constants/status_code';
import { useCallServices } from '@hooks/use_call_services';
import { legalClientsAdapters } from '@models/clients/legal/adapters';
import {
    LegalClientDOM,
    TLegalClientDOM,
    TLegalClientFilterDOM,
} from '@models/clients/legal/entities';
import { TStatusCodeDOM } from '@models/status_code/entities';
import { clientLegalServices } from '@services/clients/legal';
import { useSnackbar } from '@storages/zustand/snackbar';
import { useStatusCode } from '@storages/zustand/status_code';
import { ChangeEvent, FormEvent, MouseEvent, useEffect, useState } from 'react';

const INITIAL_STATE_CLIENT = new LegalClientDOM({
    id: '',
    numberMovil: '',
    address: '',
    nit: '',
    businessName: '',
    natural: false,
});

export const useClientsLegals = () => {
    const { setSnackbar, setSnackbarError } = useSnackbar();
    const { statusCode } = useStatusCode();

    const [clients, setClients] = useState<TLegalClientDOM[]>([]);
    const [total, setTotal] = useState(1);
    const [offset, setOffset] = useState(0);
    const [limit, setLimit] = useState(10);
    const [statusCodeFilter, setStatusCodeFilter] = useState('');
    const [filters, setFilters] = useState<TLegalClientFilterDOM>({
        limit: 0,
        offset: 0,
        businessName: '',
        nit: '',
        address: '',
    });
    const [showDetail, setShowDetail] = useState(false);
    const [showCreate, setShowCreate] = useState(false);
    const [clientSelect, setClientSelect] = useState<TLegalClientDOM>();
    const [clientCreate, setClientCreate] = useState(INITIAL_STATE_CLIENT);

    const { loading, callEndpointList, callEndpointApi } = useCallServices();

    useEffect(() => {
        getClients();
    }, [limit, offset, statusCodeFilter]);

    const getClients = async () => {
        try {
            const { items, total: totals } = await callEndpointList(
                clientLegalServices.getAll({
                    ...filters,
                    limit,
                    offset: offset === 0 ? 0 : offset * limit,
                    status: true,
                    statusId: statusCodeFilter,
                }),
                legalClientsAdapters,
            );
            setClients([...items]);
            if (total !== totals) setTotal(totals);
        } catch (e) {
            setSnackbarError(e as ApiError);
        }
    };

    const handleCreateClient = async () => {
        try {
            const status = statusCode.clients.find(
                ({ name }) => name === STATUS_CODE.ACTIVE,
            )!;
            clientCreate.status = status;
            const newClient = await callEndpointApi(
                clientLegalServices.createOne(clientCreate),
                legalClientsAdapters,
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
                clientLegalServices.updateOne(clientSelect),
                legalClientsAdapters,
            );

            const index = clients.findIndex((c) => c.id === clientUpdate.id);
            clients[index] = clientUpdate;
            setClients([...clients]);
            toggleShowDetail();
            setSnackbar('Cliente Actualizado');
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

    const handleChangeFilters = ({ target }: ChangeEvent<HTMLInputElement>) => {
        if (target.name === 'businessname') {
            return setFilters({
                ...filters,
                businessName: target.value,
            });
        }
        if (target.name === 'nit') {
            return setFilters({
                ...filters,
                nit: target.value,
            });
        }
        if (target.name === 'address') {
            return setFilters({
                ...filters,
                address: target.value,
            });
        }
    };

    const handleChangeClientEdit = ({ target }: ChangeEvent<HTMLInputElement>) => {
        if (!clientSelect) return;
        if (target.name === 'businessname') {
            return setClientSelect({
                ...clientSelect,
                businessName: target.value,
            });
        }
        if (target.name === 'nit') {
            return setClientSelect({
                ...clientSelect,
                nit: target.value,
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
    };

    const handleChangeClientCreate = ({ target }: ChangeEvent<HTMLInputElement>) => {
        if (target.name === 'businessname') {
            return setClientCreate({
                ...clientCreate,
                businessName: target.value,
            });
        }
        if (target.name === 'nit') {
            return setClientCreate({
                ...clientCreate,
                nit: target.value,
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
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        getClients();
    };

    const handleChangeStatusCodeFilter = (status?: TStatusCodeDOM) => {
        setStatusCodeFilter(status?.id || '');
    };

    const handleSelectClient = (client: TLegalClientDOM) => {
        setClientSelect(client);
        toggleShowDetail();
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
        handleCreateClient,
        handleUpdateClient,
        handleChangeLimit,
        handleChangeOffset,
        handleChangeFilters,
        handleChangeClientEdit,
        handleChangeClientCreate,
        handleSubmit,
        handleChangeStatusCodeFilter,
        handleSelectClient,
        toggleShowDetail,
        toggleShowCreate,
    };
};
