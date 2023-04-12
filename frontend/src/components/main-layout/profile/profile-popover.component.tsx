import { Box, Button } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import Typography from '@mui/material/Typography';
import * as React from 'react';

import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import { authStore } from 'Redux/authState';
import { userStore } from 'Redux/userState';
import authService from 'Services/authService';
import userService from 'Services/userService';
import ClientType from 'models/ClientType';
import UserModel from 'models/UserModel';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function ProfilePopover() {
  const [user, setUser] = useState<UserModel>();

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = userStore.subscribe(() => {
      setUser(userStore.getState().user);
    });

    userService
      .getUserDetails()
      .then(() => {
        setUser(userStore.getState().user);
      })
      .catch(error => {
        toast.error(error.message);
      });

    return unsubscribe;
  }, []);

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  function logout(): void {
    authService.logout();
    handleCloseUserMenu();
    navigate('/login');
    toast.success('You have been logout!');
  }

  const handleMenuItem = () => {
    const clientType = authStore.getState().user.clientType;

    switch (clientType) {
      case ClientType.Administrator:
        navigate('/dashboard/admin');
        break;
      case ClientType.Company:
        navigate('/dashboard/company');
        break;
      case ClientType.Customer:
        navigate('/dashboard/customer');
        break;
      default:
        navigate('/');
    }
    handleCloseUserMenu();
  };

  return (
    <Box>
      <Tooltip title="Open settings">
        <IconButton onClick={handleOpenUserMenu} disableRipple sx={{ p: 0 }}>
          <Typography variant="h6" p="10px">
            Hi, {user?.firstName ? ' ' + user?.firstName + ' ' + user?.lastName : user?.name}
          </Typography>
          <Avatar alt={user?.firstName ? user?.firstName : user?.name} src="?" />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: '40px', mr: 4 }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        <Box
          sx={{
            padding: '15px 20px',
            margin: '0 auto',
            gap: 2,
            display: 'flex',
            '@media (max-width: 600px)': {
              display: 'grid',
              alignContent: 'center',
              justifyContent: 'center',
              gridTemplateColumns: '1fr',
              gridGap: '10px',
            },
          }}
        >
          <Box sx={{ margin: 'auto auto' }}>
            <Avatar
              alt={user?.firstName ? user?.firstName : user?.name}
              src="?"
              sx={{ height: '100px', width: '100px', borderRadius: '10%', fontSize: 50 }}
            />
          </Box>
          <Box textAlign="center">
            <Typography variant="h6" fontWeight={600}>
              {user?.firstName ? user?.firstName + user?.lastName : user?.name}
            </Typography>
            <Typography fontSize={14}>{user?.email}</Typography>
            <Box display="flex" gap={2} mt={2}>
              <Button variant="outlined" onClick={handleMenuItem} sx={{ justifyContent: 'space-around' }}>
                My Dashboard
              </Button>
              <Button variant="outlined" color="error" onClick={logout}>
                Logout
              </Button>
            </Box>
          </Box>
        </Box>
      </Menu>
    </Box>
  );
}
export default ProfilePopover;
