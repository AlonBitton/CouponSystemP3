import { Box, Divider, Typography } from '@mui/material';
import CouponList from 'components/admin-layout/tables/couponTable';
import useTitle from 'hooks/useTitle';
import { FC } from 'react';
import 'react-alice-carousel/lib/alice-carousel.css';
import CompanyList from './tables/companyTable';
import CustomerList from './tables/customersTable';

const AdminDashboard: FC = () => {
  useTitle('Admin Dashboard');

  return (
    <Box px={10} py={5}>
      <Box sx={{ maxWidth: '90%', margin: '0 auto' }}>
        <Typography variant="h5" sx={{ margin: '0 auto' }}>
          Admin Dashboard
        </Typography>

        <Box sx={{ maxWidth: '100%', margin: '0 auto', pt: 5 }}>
          <CompanyList />

          <Divider sx={{ my: 5 }} />

          <CustomerList />

          <Divider sx={{ my: 5 }} />

          <CouponList />
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
