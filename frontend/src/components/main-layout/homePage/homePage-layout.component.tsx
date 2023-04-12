import { Box, Paper, Typography } from '@mui/material';
import { FC, useEffect } from 'react';

export const HomePage: FC = () => {
  useEffect(() => {
    document.title = 'Home Page';
  }, []);

  {
    return (
      <Box px={10} py={5}>
        <Box sx={{ maxWidth: '90%', margin: '0 auto' }}>
          <Paper sx={{ height: '100%', padding: 5 }}>
            <Typography variant="h5" mb={4}>
              HomePage
            </Typography>
            <h4>
              Hello, this is my final project at John Bryce fullstack Java course, the project is a comprehensive
              e-commerce Coupon-System.
            </h4>
            <br></br>
            <p>
              This e-commerce Coupon System project features three client types: Admin, Company, and Customer. Each type
              has a unique menu, dashboard view, and methods specific to their role. Users can log in as an
              administrator, company, or customer to access their respective features.
            </p>
            <br></br>
            <p>
              The admin can perform CRUD operations on coupons, customers, and companies in the database. The company
              can manage their own coupons by adding, updating, and deleting them. These coupons are then listed for
              customers to view and purchase. The customer can view and purchase coupons from all companies, as well as
              manage their own coupons.
            </p>
            <br></br>
            <p>
              Each coupon has a title, description, start and expiration dates, price, amount, and image. The project
              features a smart list that allows users to view, search, edit, add, and delete entities in a single
              control panel.
            </p>
            <br></br>
            <p>
              The project was built using Java, Maven, and Spring with JWT for authentication. MySQL was used as the
              database, and Node.js, React, Redux, and the MUI library were also employed.
            </p>
            <br></br>
            <Typography style={{ textAlign: 'right' }}>Alon Bitton</Typography>
          </Paper>
        </Box>
      </Box>
    );
  }
};
