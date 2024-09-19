import { useCallServices } from '@hooks/use_call_services';
import { naturalClientsAdapters } from '@models/clients/natural/adapters';
import {
    TNaturalClientDOM,
    TNaturalClientFilterDOM,
} from '@models/clients/natural/entities';
import { SelectChangeEvent } from '@mui/material';
import { clientNaturalServices } from '@services/clients/natural';
import { useSnackbar } from '@storages/zustand/snackbar';
import { ChangeEvent, FormEvent, MouseEvent, useEffect, useState } from 'react';

export const useClientsNaturals = () => {
    const { setSnackbar } = useSnackbar();

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
    const [clientSelect, setClientSelect] = useState<TNaturalClientDOM>();
    const [clientSelectClone, setClientSelectClone] = useState<TNaturalClientDOM>();

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

    const handleChangeStatusCodeFilter = (e: SelectChangeEvent) => {
        setStatusCodeFilter(e.target.value);
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
        setClientSelectClone(client);
        toggleShowDetail();
    };

    const handleChangeStatusCodeClient = ({ target }: SelectChangeEvent) => {
        if (!clientSelect) return;
        setClientSelect({
            ...clientSelect,
            status: {
                id: target.value,
                name: '',
            },
        });
    };

    const handleChangeClient = ({ target }: ChangeEvent<HTMLInputElement>) => {
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
            console.log({ e });
        }
    };

    const toggleShowDetail = () => setShowDetail(!showDetail);

    return {
        clients,
        total,
        offset,
        limit,
        statusCodeFilter,
        filters,
        showDetail,
        clientSelect,
        clientSelectClone,
        loading,
        handleChangeLimit,
        handleChangeOffset,
        handleChangeStatusCodeFilter,
        handleChangeFilters,
        handleSubmit,
        handleSelectClient,
        handleChangeStatusCodeClient,
        handleChangeClient,
        handleUpdateClient,
        toggleShowDetail,
    };
};
