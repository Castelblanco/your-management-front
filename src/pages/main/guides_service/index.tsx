import {
    Box,
    Card,
    SelectChangeEvent,
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
import { LoadingLinear } from '@atoms/loadings/linear';
import { DropDownStatusCode } from '@organisms/dropdowns/status_code';

import { DatePickerRange } from '@organisms/date_picker_range';
import { DropDownTypeServices } from '@organisms/dropdowns/type_services';
import { DropDownNovelties } from '@organisms/dropdowns/novelties';
import { useCallServices } from '@hooks/use_call_services';
import { guideServices } from '@services/guides_service';
import { useProfile } from '@storages/zustand/profile';
import { guidesServiceAdapters } from '@models/guides_service/adapters';

import styles from './styles.module.css';
import { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import {
    TGuideServiceDOM,
    TGuideServiceFilterDOM,
} from '@models/guides_service/entities';
import { addCommodityUnits } from '@helpers/add_commodity_units';
import { formatDateView } from '@helpers/format_date_view';
import { getFirstDateInMonth, getLastDateInMonth, getMillisDate } from '@tools/datetime';
import { DateRange } from '@mui/lab';
import { DateTime } from 'luxon';
import { ButtonFloatingAdd } from '@molecules/buttons/floating_add';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@constants/routes';
import { TStatusCodeDOM } from '@models/status_code/entities';
import { useSnackbar } from '@storages/zustand/snackbar';
import { ApiError } from '@common/errors/api_error';

export default function MainGuidesService() {
    const { profile } = useProfile();
    const { setSnackbarError } = useSnackbar();

    const [guides, setGuides] = useState<TGuideServiceDOM[]>([]);
    const [filters, setFilters] = useState<TGuideServiceFilterDOM>({
        userId: profile.id,
        status: true,
        clientOrigin: true,
        clientDestination: true,
        pointSaleOrigin: true,
        pointSaleDestination: true,
        service: true,
        limit: 0,
        offset: 0,
        startDate: undefined,
        endDate: undefined,
        statusId: '',
        noveltyId: '',
        serviceId: '',
    });
    const [total, setTotal] = useState(1);
    const [offset, setOffset] = useState(0);
    const [limit, setLimit] = useState(10);

    const [dateFilter, setDateFilter] = useState<DateRange<DateTime>>([
        getFirstDateInMonth(),
        getLastDateInMonth(),
    ]);

    const navigate = useNavigate();

    const { loading, callEndpointList } = useCallServices();

    useEffect(() => {
        getGuides();
    }, [filters, dateFilter]);

    const getGuides = async () => {
        try {
            const { items, total: totals } = await callEndpointList(
                guideServices.getAll({
                    ...filters,
                    startDate: getMillisDate(dateFilter[0]!),
                    endDate: getMillisDate(dateFilter[1]!),
                    limit,
                    offset: offset === 0 ? 0 : offset * limit,
                }),
                guidesServiceAdapters,
            );
            setGuides([...items]);
            if (totals !== total) setTotal(totals);
        } catch (e) {
            setSnackbarError(e as ApiError);
        }
    };

    const handleSelectGuide = (guide: TGuideServiceDOM) => {
        navigate(`${ROUTES.GUIDES_SERVICE}/${guide.id}`);
    };

    const handleChangeStatusFilter = (status?: TStatusCodeDOM) => {
        setFilters({
            ...filters,
            statusId: status?.id,
        });
    };

    const handleChangeTypeServiceFilter = ({ target }: SelectChangeEvent) => {
        setFilters({
            ...filters,
            serviceId: target.value,
        });
    };

    const handleChangeNoveltyFilter = ({ target }: SelectChangeEvent) => {
        setFilters({
            ...filters,
            noveltyId: target.value,
        });
    };

    const handleChangeDateFilter = (date: DateRange<DateTime<boolean>>) => {
        setDateFilter(date);
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

    const handleCreateGuide = () => navigate(ROUTES.GUIDES_SERVICE_CREATE);

    return (
        <>
            <ButtonFloatingAdd onClick={handleCreateGuide} />
            <Box className={styles.container}>
                <Card className={styles.box_content}>
                    <Toolbar>
                        <form /* onSubmit={handleSubmit} */ className={styles.form}>
                            <DatePickerRange
                                value={dateFilter}
                                onChange={handleChangeDateFilter}
                            />
                            <DropDownTypeServices
                                onChange={handleChangeTypeServiceFilter}
                                value={filters.serviceId}
                                showvoid
                            />
                            <DropDownNovelties
                                onChange={handleChangeNoveltyFilter}
                                value={filters.noveltyId}
                                showvoid
                            />
                            <DropDownStatusCode
                                onChange={handleChangeStatusFilter}
                                value={filters.statusId}
                                className={styles.input}
                                type="guides_service"
                                showvoid
                            />
                            <input type="submit" hidden />
                        </form>
                    </Toolbar>
                    <TableContainer className={styles.table_container}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell className={styles.head_txt}>
                                        Fecha Y Hora
                                    </TableCell>
                                    <TableCell className={styles.head_txt}>
                                        Guía
                                    </TableCell>
                                    <TableCell className={styles.head_txt}>
                                        Estado
                                    </TableCell>
                                    <TableCell className={styles.head_txt}>
                                        Remitente
                                    </TableCell>
                                    <TableCell className={styles.head_txt}>
                                        Dir Remitente
                                    </TableCell>
                                    <TableCell className={styles.head_txt}>
                                        Tel Remitente
                                    </TableCell>
                                    <TableCell className={styles.head_txt}>
                                        Origen
                                    </TableCell>
                                    <TableCell className={styles.head_txt}>
                                        Destinatario
                                    </TableCell>
                                    <TableCell className={styles.head_txt}>
                                        Dir Destino
                                    </TableCell>
                                    <TableCell className={styles.head_txt}>
                                        Tel Destino
                                    </TableCell>
                                    <TableCell className={styles.head_txt}>
                                        Destino
                                    </TableCell>
                                    <TableCell className={styles.head_txt}>
                                        Servicio
                                    </TableCell>
                                    <TableCell className={styles.head_txt}>
                                        Unidades
                                    </TableCell>
                                    <TableCell className={styles.head_txt}>
                                        Total $
                                    </TableCell>
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
                                {guides.map((guide, i) => (
                                    <TableRow
                                        onClick={() => handleSelectGuide(guide)}
                                        className={styles.column_body}
                                        hover
                                        key={i}
                                    >
                                        <GuideRow guide={guide} />
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        {guides.length === 0 && !loading && (
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
                        labelRowsPerPage="Guias por pagina"
                    />
                </Card>
            </Box>
        </>
    );
}

type TGuideRowProps = {
    guide: TGuideServiceDOM;
};

const GuideRow = ({ guide }: TGuideRowProps) => {
    return (
        <>
            <TableCell>{formatDateView(guide.createdAt)}</TableCell>
            <TableCell>{guide.number}</TableCell>
            <TableCell>{guide.status?.name}</TableCell>
            {guide.clientOrigin?.natural ? (
                <TableCell>
                    {guide.clientOrigin?.firstName} {guide.clientOrigin?.lastName}
                </TableCell>
            ) : (
                <TableCell>
                    {guide.clientOrigin?.businessName} {guide.clientOrigin?.nit}
                </TableCell>
            )}

            <TableCell>{guide.clientOrigin?.address}</TableCell>
            <TableCell>{guide.clientOrigin?.numberMovil}</TableCell>
            <TableCell>{guide.pointSaleOrigin?.municipality}</TableCell>

            {guide.clientDestination?.natural ? (
                <TableCell>
                    {guide.clientDestination?.firstName}
                    {guide.clientDestination?.lastName}
                </TableCell>
            ) : (
                <TableCell>
                    {guide.clientDestination?.businessName}
                    {guide.clientDestination?.nit}
                </TableCell>
            )}

            <TableCell>{guide.clientDestination?.address}</TableCell>
            <TableCell>{guide.clientDestination?.numberMovil}</TableCell>
            <TableCell>{guide.pointSaleDestination?.municipality}</TableCell>
            <TableCell>{guide.service?.name}</TableCell>
            <TableCell>{addCommodityUnits(guide.commodity)}</TableCell>
            <TableCell>${guide.price}</TableCell>
        </>
    );
};
