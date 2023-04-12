import { ThemeProvider } from '@emotion/react';
import { authStore } from 'Redux/authState';
import ErrorPage from 'components/404/errorPage-layout.component';
import AdminDashboard from 'components/admin-layout/admin-main-layout.component';
import Login from 'components/auth-layout/login/login-layout.component';
import CompanyDashboard from 'components/company-layout/company-main-layout.component';
import CustomerDashboard from 'components/customer-layout/customer-main-layout.component';
import { HomePage } from 'components/main-layout/homePage/homePage-layout.component';
import MainLayout from 'components/main-layout/main-layout.component';
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import theme from './theme';

type LayoutProps = {
  children: React.ReactNode;
};


export const Layout = ({ children }: LayoutProps) => {
  return (
    <div>
      <MainLayout />
      <main>{children}</main>
    </div>
  );
};

const App = () => {

  const [isLoggedIn, setIsLoggedIn] = useState(null);


  useEffect(() => {
    const unsubscribe = authStore.subscribe(() => {
      const state = authStore.getState();
      const loggedIn = !!state.user;
      setIsLoggedIn(loggedIn);
    });

    const state = authStore.getState();
    const loggedIn = !!state.user;
    setIsLoggedIn(loggedIn);

    return unsubscribe;
  }, []);

  return (
  <>
    <ThemeProvider theme={theme} >
      <BrowserRouter>
        {isLoggedIn ? (
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Layout><HomePage/></Layout>} />
          <Route path="/dashboard/admin" element={<Layout><AdminDashboard/></Layout>} />
          <Route path="/dashboard/company" element={<Layout><CompanyDashboard/></Layout>} />
          <Route path="/dashboard/customer" element={<Layout><CustomerDashboard/></Layout>} />  
          {/* Pages without Sidebar and Navbar */}
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<ErrorPage />} />
        
        </Routes>

        ) : (
        <Routes>
          <Route path='/*' element={<Navigate to="/login"/>}/>
          <Route path="/login" element={<Login />} />
        </Routes>
      )}
    </BrowserRouter>
      </ThemeProvider>
      <ToastContainer />
      </>
  );
};

export default App;
