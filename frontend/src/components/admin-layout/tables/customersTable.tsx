import { Delete, Edit } from '@mui/icons-material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Hidden,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import adminService from 'Services/adminService';
import MaterialReactTable, {
  type MRT_Cell,
  type MRT_ColumnDef,
  type MRT_Row,
  type MaterialReactTableProps,
} from 'material-react-table';
import UserModel from 'models/UserModel';
import moment from 'moment';
import { useCallback, useEffect, useMemo, useState } from 'react';
import CreateNewAccountModal from '../actions/createNewCustomerModal';

const CustomerList = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState<UserModel[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const customers = await adminService.getAllCustomers();
      if (customers) {
        setTableData(customers);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleCreateNewRow = (values: UserModel) => {
    tableData.push(values);
    setTableData([...tableData]);
  };

  const handleSaveRowEdits: MaterialReactTableProps<UserModel>['onEditingRowSave'] = async ({
    exitEditingMode,
    row,
    values,
  }) => {
    const updatedCustomer = await adminService.updateCustomer(values);
    if (updatedCustomer) {
      tableData[row.index] = updatedCustomer;
      setTableData([...tableData]);
    }
    exitEditingMode();
    setLoading(false);
  };

  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };

  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<MRT_Row<UserModel> | null>(null);
  const customerName = `${selectedRow?.getValue('firstName')} ${selectedRow?.getValue('lastName')}`;

  const handleDeleteRow = (row: MRT_Row<UserModel>) => {
    setDeleteConfirmationOpen(true);
    setSelectedRow(row);
  };

  const handleDeleteConfirmation = async () => {
    await adminService.deleteCustomer(selectedRow?.getValue('id'));
    const newData = [...tableData];
    newData.splice(selectedRow?.index || 0, 1);
    setTableData(newData);
    setDeleteConfirmationOpen(false);
  };

  const [validationErrors, setValidationErrors] = useState<{
    [cellId: string]: string;
  }>({});

  const validateRequired = (value: string) => !!value.length;
  const validateEmail = (email: string) =>
    !!email.length &&
    email
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      );

  const getCommonEditTextFieldProps = useCallback(
    (cell: MRT_Cell<UserModel>): MRT_ColumnDef<UserModel>['muiTableBodyCellEditTextFieldProps'] => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
        onBlur: event => {
          const isValid =
            cell.column.id === 'email' ? validateEmail(event.target.value) : validateRequired(event.target.value);
          if (!isValid) {
            setValidationErrors({
              ...validationErrors,
              [cell.id]: `${cell.column.columnDef.header} is required`,
            });
          } else {
            delete validationErrors[cell.id];
            setValidationErrors({
              ...validationErrors,
            });
          }
        },
      };
    },
    [validationErrors],
  );

  const columns = useMemo<MRT_ColumnDef<UserModel>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        enableColumnOrdering: false,
        enableEditing: false,
        enableSorting: true,
        size: 80,
      },
      {
        accessorKey: 'firstName',
        header: 'First Name',
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: 'email',
        header: 'Email',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: 'email',
        }),
      },
    ],
    [getCommonEditTextFieldProps],
  );

  if (Loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          pb: 3,
          display: 'flex',
          justifyContent: 'flex-end',
          '@media (max-width: 600px)': { justifyContent: 'center' },
        }}
      >
        <Button color="primary" onClick={() => setCreateModalOpen(true)} variant="contained">
          Add New Customer
        </Button>
      </Box>

      {tableData.length === 0 ? (
        <Typography variant="subtitle1">No data found</Typography>
      ) : (
        <MaterialReactTable
          displayColumnDefOptions={{
            'mrt-row-actions': {
              muiTableHeadCellProps: {
                align: 'center',
              },
              size: 120,
            },
          }}
          columns={columns}
          data={tableData}
          editingMode="modal"
          enableColumnOrdering
          enableEditing
          onEditingRowSave={handleSaveRowEdits}
          onEditingRowCancel={handleCancelRowEdits}
          renderRowActions={({ row, table }) => (
            <Box sx={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Tooltip arrow placement="left" title="Edit">
                <IconButton onClick={() => table.setEditingRow(row)}>
                  <Edit />
                </IconButton>
              </Tooltip>
              <Tooltip arrow placement="right" title="Delete">
                <IconButton color="error" onClick={() => handleDeleteRow(row)}>
                  <Delete />
                </IconButton>
              </Tooltip>
            </Box>
          )}
          renderTopToolbarCustomActions={() => (
            <Hidden smDown>
              <Box sx={{ display: 'flex', alignItems: 'center', p: 1, color: 'text.disabled' }}>
                <AccountCircleIcon />
                <Typography variant="h6" marginLeft={1}>
                  Customer List
                </Typography>
              </Box>
            </Hidden>
          )}
          renderDetailPanel={({ row }) => (
            <Box>
              {row.original.coupons && row.original.coupons.length > 0 && (
                <Box px={3}>
                  <Typography variant="h6" fontWeight={500} pb={2}>
                    Owned coupons:
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Title</TableCell>
                          <TableCell align="left">Category</TableCell>
                          <TableCell align="left">Description</TableCell>
                          <TableCell align="left">End Date</TableCell>
                          <TableCell align="left">Price&nbsp;($)</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {row.original.coupons.map(row => (
                          <TableRow key={row.description} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell component="th" scope="row">
                              {row.title}
                            </TableCell>
                            <TableCell align="left">{row.category}</TableCell>
                            <TableCell align="left">{row.description}</TableCell>
                            <TableCell align="left">{moment(row.endDate).format('DD/MM/YYYY')}</TableCell>
                            <TableCell align="left">${row.price.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}
            </Box>
          )}
        />
      )}

      <CreateNewAccountModal
        columns={columns}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNewRow}
      />

      <Dialog open={deleteConfirmationOpen} onClose={() => setDeleteConfirmationOpen(false)}>
        <DialogTitle textAlign="center" color="red">
          Delete Customer
        </DialogTitle>
        <DialogContent>
          <Typography textAlign={'center'}>
            Are you sure you want to delete this Customer?
            <br />
            <br />
            <b>{customerName}</b>
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-around', mb: 2 }}>
          <Button onClick={() => setDeleteConfirmationOpen(false)} variant="contained" color="inherit">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirmation} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CustomerList;
