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
import { DropDownUserRoles } from '@organisms/dropdowns/user_roles';

import { ButtonFloatingAdd } from '@molecules/buttons/floating_add';
import { Modal } from '@organisms/modal';
import { FormUser } from '@templates/forms/user/index';
import { useMainUsers } from './hook';

import styles from './styles.module.css';

export default function MainUsers() {
    const {
        users,
        userSelect,
        userCreate,
        confirmPassword,
        statusCodeFilter,
        roleFilter,
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
    } = useMainUsers();

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
