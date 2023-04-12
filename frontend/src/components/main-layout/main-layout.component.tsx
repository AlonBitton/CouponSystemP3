import { AppBar, Box, Hidden, Toolbar, useMediaQuery, useTheme } from '@mui/material';
import Typography from '@mui/material/Typography';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SideBar from './navigation/sidebar.component';
import ProfilePopover from './profile/profile-popover.component';

const drawerWidth = '80px';

export type SidebarProps = {};

const MainLayout: React.FC<SidebarProps> = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      <Box sx={{ zIndex: 99, position: 'fixed', p: 1 }}>
        <SideBar isSmall={isSmall} />
      </Box>
      <Box height="100%" display={'flex'}>
        <AppBar position="fixed" sx={{ background: 'none', boxShadow: 0, backdropFilter: 'blur(6px)', zIndex: 2 }}>
          <Toolbar>
            <Box flexGrow={1}>
              <Link to="/dashboard" className="all_unset">
                <Box
                  display="flex"
                  alignItems="center"
                  gap={0.5}
                  sx={{ cursor: 'pointer', ml: isSmall ? 0 : drawerWidth }}
                >
                  <Hidden smDown>
                    <Typography variant="h5" sx={{ width: 'fit-content', color: 'black' }}>
                      CouponSystem | A.B.
                    </Typography>
                  </Hidden>
                </Box>
              </Link>
            </Box>
            <ProfilePopover />
          </Toolbar>
        </AppBar>
        <Toolbar />
      </Box>
    </>
  );
};

export default MainLayout;
