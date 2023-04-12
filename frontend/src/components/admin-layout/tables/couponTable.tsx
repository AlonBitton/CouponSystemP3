import { Delete, Edit } from '@mui/icons-material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
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
  MenuItem,
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
import Category from 'models/Category';
import CouponModel from 'models/CouponModel';
import { useCallback, useEffect, useMemo, useState } from 'react';
import CreateNewCouponModal from '../actions/createNewCouponModal';

const CouponList = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState<CouponModel[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const coupons = await adminService.getAllCoupons();
      if(coupons){
        setTableData(coupons);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleCreateNewRow = (values: CouponModel) => {
    tableData.push(values);
    setTableData([...tableData]);
  };

  const handleSaveRowEdits: MaterialReactTableProps<CouponModel>['onEditingRowSave'] = async ({
    exitEditingMode,
    row,
    values,
  }) => {
    const updatedCoupon = await adminService.updateCoupon(values);
    if (updatedCoupon) {
      tableData[row.index] = updatedCoupon;
      setTableData([...tableData]);
    }
    exitEditingMode();
    setLoading(false);
  };

  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };

  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<MRT_Row<CouponModel> | null>(null);
  const couponDetails = `${selectedRow?.getValue('title')} ${selectedRow?.getValue('category')} `;

  const handleDeleteRow = (row: MRT_Row<CouponModel>) => {
    setDeleteConfirmationOpen(true);
    setSelectedRow(row);
  };

  const handleDeleteConfirmation = async () => {
    await adminService.deleteCoupon(selectedRow?.getValue('id'));
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
    (cell: MRT_Cell<CouponModel>): MRT_ColumnDef<CouponModel>['muiTableBodyCellEditTextFieldProps'] => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
        onBlur: event => {
          const isValid =
            cell.column.id === 'email' ? validateEmail(event.target.value) : validateRequired(event.target.value);
          if (!isValid) {
            //set validation error for cell if invalid
            setValidationErrors({
              ...validationErrors,
              [cell.id]: `${cell.column.columnDef.header} is required`,
            });
          } else {
            //remove validation error for cell if valid
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

  const columns = useMemo<MRT_ColumnDef<CouponModel>[]>(
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
        accessorKey: 'category',
        header: 'Category',
        muiTableBodyCellEditTextFieldProps: {
          select: true,
          children: Object.keys(Category).map((key: string) => (
            <MenuItem key={key} value={Category[key as keyof typeof Category]}>
              {Category[key as keyof typeof Category]}
            </MenuItem>
          )),
        },
      },
      {
        accessorKey: 'title',
        header: 'Title',
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: 'description',
        header: 'Description',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: 'text',
        }),
      },
      {
        accessorKey: 'startDate',
        header: 'Start Date',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: 'date',
        }),
      },
      {
        accessorKey: 'endDate',
        header: 'End Date',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: 'date',
        }),
      },
      {
        accessorKey: 'amount',
        header: 'Amount',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: 'number',
        }),
      },
      {
        accessorKey: 'price',
        header: 'Price',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: 'number',
        }),
      },
      {
        accessorKey: 'image',
        header: 'Image',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
    ],
    [getCommonEditTextFieldProps],
  );

  if (Loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
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
          Add New Coupon
        </Button>
      </Box>
      {tableData?.length === 0 ? (
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
                <LocalOfferIcon />
                <Typography variant="h6" marginLeft={1}>
                  Coupon List
                </Typography>
              </Box>
            </Hidden>
          )}
        />
      )}

      <CreateNewCouponModal
        columns={columns}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNewRow}
      />
      <Dialog open={deleteConfirmationOpen} onClose={() => setDeleteConfirmationOpen(false)}>
        <DialogTitle textAlign="center" color="red">
          Delete Coupon
        </DialogTitle>
        <DialogContent>
          <Typography textAlign={'center'}>
            Are you sure you want to delete this Coupon?
            <br />
            <br />
            <b>{couponDetails}</b>
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

export default CouponList;
