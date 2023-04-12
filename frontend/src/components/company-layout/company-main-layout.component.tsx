import { Box, Typography } from '@mui/material';
import useTitle from 'hooks/useTitle';
import { FC } from 'react';
import CouponList from './table/couponTable';

const CompanyDashboard: FC = () => {
  useTitle('Company Dashboard');

  return (
    <Box px={10} py={5}>
      <Box sx={{ maxWidth: '90%', margin: '0 auto' }}>
        <Typography variant="h5" sx={{ margin: '0 auto' }}>
          Company Dashboard
        </Typography>

        <Box sx={{ maxWidth: '100%', margin: '0 auto', pt: 5 }}>
          <CouponList />
        </Box>
      </Box>
    </Box>
  );
};

export default CompanyDashboard;
