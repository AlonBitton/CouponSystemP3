import { Delete, Edit } from '@mui/icons-material';
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
  Tooltip,
  Typography,
} from '@mui/material';
import MaterialReactTable, {
  type MaterialReactTableProps,
  type MRT_Cell,
  type MRT_ColumnDef,
  type MRT_Row,
} from 'material-react-table';
import UserModel from 'models/UserModel';
import { useCallback, useEffect, useMemo, useState } from 'react';
import adminService from 'Services/adminService';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import CreateNewCompanyModal from '../actions/createNewCompanyModal';

const CompanyList = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState<UserModel[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const companies = await adminService.getAllCompanies();
      if(companies){
        setTableData(companies);
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
    const updatedCompany = await adminService.updateCompany(values);
    if (updatedCompany) {
      tableData[row.index] = updatedCompany;
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
  const companyName = `${selectedRow?.getValue('name')}`;

  const handleDeleteRow = (row: MRT_Row<UserModel>) => {
    setDeleteConfirmationOpen(true);
    setSelectedRow(row);
  };

  const handleDeleteConfirmation = async () => {
    await adminService.deleteCompany(selectedRow?.getValue('id'));
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
        accessorKey: 'name',
        header: 'Company Name',
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
          Add New Company
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
              size: 100,
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
                <SupervisedUserCircleIcon />
                <Typography variant="h6" marginLeft={1}>
                  Company List
                </Typography>
              </Box>
            </Hidden>
          )}
        />
      )}

      <CreateNewCompanyModal
        columns={columns}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNewRow}
      />

      <Dialog open={deleteConfirmationOpen} onClose={() => setDeleteConfirmationOpen(false)}>
        <DialogTitle textAlign="center" color="red">
          Delete Company
        </DialogTitle>
        <DialogContent>
          <Typography textAlign={'center'}>
            Are you sure you want to delete this Company?
            <br />
            <br />
            <b>{companyName}</b>
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

export default CompanyList;
