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
import { LoadingLinear } from '@atoms/loadings/linear';
import { Input } from '@atoms/input';
import { DropDownStatusCode } from '@organisms/dropdowns/status_code';
import { Modal } from '@organisms/modal';
import { useClientsNaturals } from './hook';
import { FormClientNatural } from '@templates/forms/clients/natural';
import { ButtonFloatingAdd } from '@molecules/buttons/floating_add';

import styles from '../styles.module.css';

export const ClientsNaturals = () => {
    const {
        clients,
        total,
        offset,
        limit,
        statusCodeFilter,
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
        handleChangeClientCreate,
        handleCreateClient,
        handleChangeClientEdit,
        handleUpdateClient,
        toggleShowDetail,
        toggleShowCreate,
    } = useClientsNaturals();

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
                                    <TableCell sx={{ padding: 0 }} colSpan={4}>
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
                    labelRowsPerPage="Clientes por pagina"
                />
            </Card>
            <Modal show={showDetail} onClose={toggleShowDetail}>
                <FormClientNatural
                    title="Detalle"
                    client={clientSelect}
                    onChangeFirstName={handleChangeClientEdit}
                    onChangeLastName={handleChangeClientEdit}
                    onChangeAddress={handleChangeClientEdit}
                    onChangeDocument={handleChangeClientEdit}
                    onChangeNumberMovil={handleChangeClientEdit}
                    onChangeStatus={handleChangeStatusCodeClient}
                    onUpdate={handleUpdateClient}
                    onCancel={toggleShowDetail}
                    loading={loading}
                />
            </Modal>
            <Modal show={showCreate} onClose={toggleShowCreate}>
                <FormClientNatural
                    title="Crear Cliente"
                    client={clientCreate}
                    onChangeFirstName={handleChangeClientCreate}
                    onChangeLastName={handleChangeClientCreate}
                    onChangeAddress={handleChangeClientCreate}
                    onChangeDocument={handleChangeClientCreate}
                    onChangeNumberMovil={handleChangeClientCreate}
                    onCreate={handleCreateClient}
                    onCancel={toggleShowCreate}
                    loading={loading}
                    isCreate
                />
            </Modal>
        </Box>
    );
};
