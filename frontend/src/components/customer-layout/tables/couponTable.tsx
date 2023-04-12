import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { Box, CircularProgress, Hidden, IconButton, Tooltip, Typography } from '@mui/material';
import customerService from 'Services/customerService';
import PurchaseButton from 'components/customer-layout/buttons/purchase-button';
import MaterialReactTable, { type MRT_ColumnDef } from 'material-react-table';
import CouponModel from 'models/CouponModel';
import { useEffect, useMemo, useState } from 'react';

const CouponList = () => {
  const [Loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState<CouponModel[]>([]);

  useEffect(() => {
    const fetchCoupons = async () => {
      setLoading(true);
      const coupons = await customerService.getAllCoupons();
      if (coupons) {
        setTableData(coupons);
      }
      setLoading(false);
    };

    fetchCoupons();
  }, []);

  const columns = useMemo<MRT_ColumnDef<CouponModel>[]>(
    () => [
      {
        accessorKey: 'category',
        header: 'Category',
        enableEditing: false,
      },
      {
        accessorKey: 'title',
        header: 'Title',
        enableEditing: false,
        size: 140,
      },
      {
        accessorKey: 'description',
        header: 'Description',
        enableEditing: false,
      },
      {
        accessorKey: 'endDate',
        header: 'End Date',
        enableEditing: false,
      },
      {
        accessorKey: 'amount',
        header: 'Amount',
        enableEditing: false,
      },
      {
        accessorKey: 'price',
        header: 'Price',
        enableEditing: false,
      },
    ],
    [],
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
      {tableData.length === 0 ? (
        <Typography variant="subtitle1">No data found</Typography>
      ) : (
        <MaterialReactTable
          displayColumnDefOptions={{
            'mrt-row-actions': {
              muiTableHeadCellProps: {
                align: 'center',
              },
              size: 50,
            },
          }}
          columns={columns}
          data={tableData}
          enableColumnOrdering
          renderRowActions={({ row, table }) => (
            <>
              <Box sx={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <Tooltip arrow placement="left" title="Purchase">
                  <IconButton>
                    <PurchaseButton coupon={row.original} />
                  </IconButton>
                </Tooltip>
              </Box>
            </>
          )}
          renderDetailPanel={({ row }) => (
            <Box
              sx={{
                display: 'grid',
                margin: 'auto ',
                width: '100%',
              }}
            >
              <Typography>Title: {row.original.description}</Typography>
              <Typography>Description: {row.original.category}</Typography>
              <Typography>Amount left: {row.original.amount}</Typography>
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
    </>
  );
};

export default CouponList;
