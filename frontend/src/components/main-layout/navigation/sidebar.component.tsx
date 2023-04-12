import { Menu } from '@mui/icons-material';
import { Box, Drawer, Hidden, IconButton, List, ListItemButton, styled, Tooltip } from '@mui/material';
import { logoImg } from 'assets';
import ClientType from 'models/ClientType';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authStore } from 'Redux/authState';
import ScrollBar from 'simplebar-react';
import topMenuList from './topMenuList';

export type NavigationProps = {
  isSmall: boolean;
};

const MainMenu = styled(Box)(({ theme }) => ({
  left: 0,
  top: 0,
  height: '100vh',
  position: 'fixed',
  boxShadow: theme.shadows[1],
  transition: 'left 0.3s ease',
  zIndex: 2,
  backgroundColor: theme.palette.background.paper,
}));

const StyledListItemButton = styled(ListItemButton)(() => ({
  marginBottom: '1rem',
  justifyContent: 'center',
  '&:hover': { backgroundColor: 'transparent' },
}));

const SideBar: React.FC<NavigationProps> = ({ isSmall }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const onOpenHandler = () => setOpen(true);
  const onCloseHandler = () => setOpen(false);

  const handleActiveMainMenu = (menuItem: any) => () => {
    navigate(menuItem.path);
    onCloseHandler();
  };

  const filteredMenuList = topMenuList.filter(item => {
    if (item.path === '/' || item.path === '/dashboard' || item.path === '/logout') {
      return true;
    }
    const clientType = authStore.getState().user.clientType;
    switch (clientType) {
      case ClientType.Administrator:
        return item.path === '/dashboard/admin';
      case ClientType.Company:
        return item.path === '/dashboard/company';
      case ClientType.Customer:
        return item.path === '/dashboard/customer';
      default:
        return false;
    }
  });

  const mainSideBarContent = (
    <List sx={{ height: '100%' }}>
      <StyledListItemButton disableRipple>
        <img width="54px" height="54px" src={logoImg} alt="logo" />
      </StyledListItemButton>

      <ScrollBar style={{ maxHeight: 'calc(100% - 50px)' }}>
        {filteredMenuList.map((nav, index) => (
          <Tooltip title={nav.title} placement="right" key={index}>
            <StyledListItemButton disableRipple onClick={handleActiveMainMenu(nav)}>
              <nav.Icon
                sx={{
                  color: 'primary.main',
                }}
              />
            </StyledListItemButton>
          </Tooltip>
        ))}
      </ScrollBar>
    </List>
  );
  if (isSmall) {
    return (
      <Hidden smUp>
        <IconButton
          color="inherit"
          onClick={onOpenHandler}
          sx={{ color: 'black', justifyContent: 'right', float: 'right' }}
        >
          <Menu />
        </IconButton>
        <Drawer anchor="right" open={open} onClose={onCloseHandler} PaperProps={{ sx: { width: 80 } }}>
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              width: 'inherit',
              flexDirection: 'column',
              boxShadow: theme => theme.shadows[1],
              backgroundColor: theme => theme.palette.background.paper,
              '& .simplebar-track.simplebar-vertical': { width: 7 },
              '& .simplebar-scrollbar:before': {
                background: theme => theme.palette.text.primary,
              },
            }}
          >
            {mainSideBarContent}
          </Box>
        </Drawer>
      </Hidden>
    );
  }
  return <MainMenu>{mainSideBarContent}</MainMenu>;
};

export default SideBar;
