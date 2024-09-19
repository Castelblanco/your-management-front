import {
    Box,
    Card,
    CardActions,
    CardContent,
    CardHeader,
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
import { Input } from '@atoms/input';
import { DropDownStatusCode } from '@organisms/dropdowns/status_code';

import styles from '../styles.module.css';
import { Modal } from '@organisms/modal';
import { ButtonSecondary } from '@molecules/buttons/secondary';
import { validObjects } from '@helpers/valid_objects';
import { useClientsNaturals } from './hook';

export const ClientsNaturals = () => {
    const {
        clients,
        total,
        offset,
        limit,
        statusCodeFilter,
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
    } = useClientsNaturals();

    return (
        <Box className={styles.container}>
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
                            name="address"
                            label="Dirección"
                            onChange={handleChangeFilters}
                        />
                        <DropDownStatusCode
                            onChange={handleChangeStatusCodeFilter}
                            value={statusCodeFilter}
                            className={styles.input}
                            type="clients"
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
                                    Dirección
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
                            {clients.map((client, i) => (
                                <TableRow
                                    onClick={() => handleSelectClient(client)}
                                    className={styles.column_body}
                                    hover
                                    key={i}
                                >
                                    <TableCell>{client.firstName}</TableCell>
                                    <TableCell>{client.lastName}</TableCell>
                                    <TableCell>{client.address}</TableCell>
                                    <TableCell>{client.status?.name}</TableCell>
                                </TableRow>
                            ))}
                            {clients.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4}>
                                        <Typography className={styles.not_found_txt}>
                                            Sin Resultados
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    count={total}
                    page={offset}
                    rowsPerPage={limit}
                    rowsPerPageOptions={[10, 50, 100]}
                    onPageChange={handleChangeOffset}
                    onRowsPerPageChange={handleChangeLimit}
                    component={'div'}
                />
            </Card>
            <Modal show={showDetail} onClose={toggleShowDetail}>
                <Card className={styles.box_content_edit}>
                    <CardHeader title="Detalle" />
                    <CardContent>
                        <form onSubmit={handleSubmit} className={styles.form_update}>
                            <Input
                                value={clientSelect?.firstName}
                                className={styles.input}
                                label="Nombre"
                                name="firstname"
                                onChange={handleChangeClient}
                            />
                            <Input
                                value={clientSelect?.lastName}
                                className={styles.input}
                                label="Apellido"
                                name="lastname"
                                onChange={handleChangeClient}
                            />
                            <Input
                                value={clientSelect?.numberMovil}
                                className={styles.input}
                                label="Telefono"
                                name="number_movil"
                                onChange={handleChangeClient}
                            />
                            {clientSelect && (
                                <DropDownStatusCode
                                    value={clientSelect.status?.id}
                                    className={styles.input}
                                    onChange={handleChangeStatusCodeClient}
                                    type="clients"
                                />
                            )}
                            <Input
                                value={clientSelect?.address}
                                className={styles.input}
                                label="Dirección"
                                name="address"
                                onChange={handleChangeClient}
                            />
                            <Input
                                value={clientSelect?.documentId}
                                className={styles.input}
                                label="Documento"
                                name="document"
                                onChange={handleChangeClient}
                            />
                        </form>
                    </CardContent>
                    <CardActions>
                        <ButtonSecondary
                            onClick={handleUpdateClient}
                            loading={loading}
                            disabled={validObjects(clientSelect, clientSelectClone)}
                        >
                            Actualizar
                        </ButtonSecondary>
                        <ButtonSecondary onClick={toggleShowDetail}>
                            Cancelar
                        </ButtonSecondary>
                    </CardActions>
                </Card>
            </Modal>
        </Box>
    );
};
