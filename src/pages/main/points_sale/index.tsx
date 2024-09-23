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
import styles from './styles.module.css';
import { ButtonFloatingAdd } from '@molecules/buttons/floating_add';
import { LoadingLinear } from '@atoms/loadings/linear';
import { useCallServices } from '@hooks/use_call_services';
import { ChangeEvent, FormEvent, MouseEvent, useEffect, useState } from 'react';
import { TPointSaleDOM, TPointSaleFilterDOM } from '@models/points_sale/entities';
import { useSnackbar } from '@storages/zustand/snackbar';
import { ApiError } from '@common/errors/api_error';
import { pointsSaleServices } from '@services/points_sale';
import { pointsSaleAdapters } from '@models/points_sale/adapters';
import { Input } from '@atoms/input';
import { DropDownStatusCode } from '@organisms/dropdowns/status_code';
import { TStatusCodeDOM } from '@models/status_code/entities';
import { Modal } from '@organisms/modal';
import { FormPointsSale } from '@templates/forms/points_sale';

const INITIAL_STATE_POINT: TPointSaleDOM = {
    id: '',
    name: '',
    address: '',
    budget: 0,
    department: '',
    municipality: '',
    neighborhood: '',
    latitude: 0,
    longitude: 0,
};

export default function MainPointsSales() {
    const { setSnackbarError, setSnackbar } = useSnackbar();

    const [points, setPoints] = useState<TPointSaleDOM[]>([]);
    const [pointCreate, setPointCreate] = useState<TPointSaleDOM>(INITIAL_STATE_POINT);
    const [pointSelect, setPointSelect] = useState<TPointSaleDOM>();
    const [statusCodeFilter, setStatusCodeFilter] = useState('');
    const [filters, setFilters] = useState<TPointSaleFilterDOM>({
        limit: 0,
        offset: 0,
        name: '',
    });
    const [total, setTotal] = useState(1);
    const [offset, setOffset] = useState(0);
    const [limit, setLimit] = useState(10);
    const [showCreate, setShowCreate] = useState(false);
    const [showDetail, setShowDetail] = useState(false);

    const { loading, callEndpointApi, callEndpointList } = useCallServices();

    useEffect(() => {
        getPoints();
    }, [limit, offset, statusCodeFilter]);

    const getPoints = async () => {
        try {
            const { items, total: totals } = await callEndpointList(
                pointsSaleServices.getAll({
                    ...filters,
                    limit,
                    offset: offset === 0 ? 0 : offset * limit,
                    statusId: statusCodeFilter,
                }),
                pointsSaleAdapters,
            );
            if (total !== totals) setTotal(totals);
            setPoints([...items]);
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

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        getPoints();
    };

    const handleChangeFilters = ({ target }: ChangeEvent<HTMLInputElement>) => {
        if (target.name === 'name') {
            return setFilters({
                ...filters,
                name: target.value,
            });
        }
    };

    const handleChangePointCreate = ({ target }: ChangeEvent<HTMLInputElement>) => {
        if (target.name === 'name') {
            return setPointCreate({
                ...pointCreate,
                name: target.value,
            });
        }
        if (target.name === 'budget') {
            return setPointCreate({
                ...pointCreate,
                budget: +target.value,
            });
        }
    };

    const handleChangeUbicationPointCreate = (point: TPointSaleDOM) => {
        setPointCreate({
            ...pointCreate,
            ...point,
        });
    };

    const handleChangeStatusPointCreate = (status?: TStatusCodeDOM) => {
        setPointCreate({
            ...pointCreate,
            status,
        });
    };

    const handlePointCreate = async () => {
        try {
            const newPoint = await callEndpointApi(
                pointsSaleServices.createOne(pointCreate),
                pointsSaleAdapters,
            );
            if (points.length >= limit) points.pop();
            setPoints([newPoint, ...points]);
            setPointCreate(INITIAL_STATE_POINT);
            toggleShowCreate();
            setSnackbar('Punto de venta Creado');
        } catch (e) {
            setSnackbarError(e as ApiError);
        }
    };

    const handlePointSelect = (point: TPointSaleDOM) => {
        setPointSelect(point);
        toggleShowDetail();
    };

    const handleChangePointEdit = ({ target }: ChangeEvent<HTMLInputElement>) => {
        if (!pointSelect) return;
        if (target.name === 'name') {
            return setPointSelect({
                ...pointSelect,
                name: target.value,
            });
        }
        if (target.name === 'budget') {
            return setPointSelect({
                ...pointSelect,
                budget: +target.value,
            });
        }
    };

    const handleChangeStatusPointEdit = (status?: TStatusCodeDOM) => {
        if (!pointSelect) return;
        setPointSelect({
            ...pointSelect,
            status,
        });
    };

    const handlePointEdit = async () => {
        try {
            if (!pointSelect) return;
            const updatePoint = await callEndpointApi(
                pointsSaleServices.updateOne(pointSelect),
                pointsSaleAdapters,
            );

            const index = points.findIndex((c) => c.id === updatePoint.id);
            points[index] = updatePoint;
            setPoints([...points]);
            toggleShowDetail();
            setSnackbar('Punto de venta Actualizado');
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
                            name="name"
                            label="Nombre"
                            onChange={handleChangeFilters}
                        />
                        <DropDownStatusCode
                            type="points_sale"
                            showvoid
                            value={statusCodeFilter}
                            onChange={handleChangeStatusCodeFilter}
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
                                    Departamento
                                </TableCell>
                                <TableCell className={styles.head_txt}>
                                    Municipio
                                </TableCell>
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
                                        colSpan={4}
                                    >
                                        <LoadingLinear />
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        )}
                        <TableBody>
                            {points.map((point, i) => (
                                <TableRow
                                    onClick={() => handlePointSelect(point)}
                                    className={styles.column_body}
                                    hover
                                    key={i}
                                >
                                    <TableCell>{point.name}</TableCell>
                                    <TableCell>{point.department}</TableCell>
                                    <TableCell>{point.municipality}</TableCell>
                                    <TableCell>{point.status?.name}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {points.length === 0 && !loading && (
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
                    labelRowsPerPage="Puntos de venta por pagina"
                />
            </Card>
            <Modal show={showCreate} onClose={toggleShowCreate}>
                <FormPointsSale
                    point={pointCreate}
                    isCreate
                    loading={loading}
                    onSelectUbication={handleChangeUbicationPointCreate}
                    onChangeName={handleChangePointCreate}
                    onChangeBudget={handleChangePointCreate}
                    onChangeStatus={handleChangeStatusPointCreate}
                    onCreate={handlePointCreate}
                    onCancel={toggleShowCreate}
                />
            </Modal>
            <Modal show={showDetail} onClose={toggleShowDetail}>
                <FormPointsSale
                    point={pointSelect}
                    loading={loading}
                    onChangeName={handleChangePointEdit}
                    onChangeBudget={handleChangePointEdit}
                    onChangeStatus={handleChangeStatusPointEdit}
                    onUpdate={handlePointEdit}
                    onCancel={toggleShowDetail}
                />
            </Modal>
        </Box>
    );
}
