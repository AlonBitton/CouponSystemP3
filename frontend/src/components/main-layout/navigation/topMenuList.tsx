import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LoginIcon from '@mui/icons-material/Login';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import Icons from 'assets/sidebar';
const index = [
  {
    title: 'Home',
    Icon: Icons.DashboardIcon,
    path: '/',
  },
  {
    title: 'Admin Dashboard',
    Icon: AdminPanelSettingsIcon,
    path: '/dashboard/admin',
 },
  {
    title: 'Company Dashboard',
    Icon: SupervisedUserCircleIcon,
    path: '/dashboard/company',
 },
  {
    title: 'Customer Dashboard',
    Icon: AccountCircleIcon,
    path: '/dashboard/customer',
 },
  {
    title: 'Login',
    Icon: LoginIcon,
    path: '/login',
  },

];



export default index;
