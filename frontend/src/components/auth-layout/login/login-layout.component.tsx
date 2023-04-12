import { yupResolver } from '@hookform/resolvers/yup';
import RefreshIcon from '@mui/icons-material/Refresh';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Card,
  CssBaseline,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  styled,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { logoImg } from 'assets';
import FacebookIcon from 'assets/socials/FacebookIcon';
import GoogleIcon from 'assets/socials/GoogleIcon';
import useTitle from 'hooks/useTitle';
import ClientType from 'models/ClientType';
import CredentialsModel from 'models/CredentialsModel';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import authService from 'Services/authService';
import { getBackgroundImage, refreshBackgroundImage } from 'utils/backgroundImage';
import * as yup from 'yup';

function Login(): JSX.Element {
  useTitle('Login | CouponSystem');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState(getBackgroundImage());

  const schema = yup.object().shape({
    email: yup.string().required(),
    password: yup.string().required(),
    clientType: yup.string().required(),
  });

  const SocialIconButton = styled(Button)(({ theme }) => ({
    height: 48,
    fontSize: 13,
    borderRadius: '6px',
    border: '2px solid',
    borderColor: 'lightgray',
  }));

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CredentialsModel>({
    resolver: yupResolver(schema),
  });

  const handleRefreshClick = () => {
    const newBackgroundImage = refreshBackgroundImage();
    setBackgroundImage(newBackgroundImage);
  };

  async function send(credentials: CredentialsModel) {
    setLoading(true);
    const response = await authService.login(credentials);
    if (response) {
      navigate('/dashboard');
    }
    setLoading(false);
  }

  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          backgroundImage: `url(${backgroundImage})`,
          minHeight: '100vh',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Tooltip title="Refresh background" placement="left">
          <IconButton
            sx={{
              bgcolor: 'background.paper',
              position: 'absolute',
              top: '2rem',
              right: '1rem',
              opacity: '90%',
              transform: 'translateY(-50%)',
            }}
            onClick={handleRefreshClick}
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
        <Card sx={{ padding: 5, maxWidth: 600, boxShadow: 3, opacity: '90%' }}>
          <Box display="flex" alignItems="center" flexDirection="column" mb={5}>
            <Box>
              <img width="54px" height="54px" src={logoImg} alt="logo" />
            </Box>
            <Typography fontSize={24} fontWeight={700}>
              Sign In
            </Typography>
          </Box>

          <Box my={1}>
            <Box justifyContent="space-between" display="flex">
              <SocialIconButton
                // onClick={loginWithGoogle}
                startIcon={<GoogleIcon sx={{ mr: 1 }} />}
              >
                Sign in with Google
              </SocialIconButton>

              <SocialIconButton
                // onClick={loginWithFacebook}
                startIcon={<FacebookIcon sx={{ mr: 1 }} />}
              >
                Sign in with Facebook
              </SocialIconButton>
            </Box>

            <Divider sx={{ my: 3, width: '100%', alignItems: 'flex-start' }}>
              <Typography color="text.disabled" px={1}>
                Or
              </Typography>
            </Divider>

            <form onSubmit={handleSubmit(send)} style={{ width: '100%' }}>
              <Box justifyContent="space-between" display="flex" gap={3} color="primary.main">
                <Box>
                  <Typography fontWeight={600} mb={1}>
                    Email
                  </Typography>
                  <TextField
                    fullWidth
                    type="email"
                    placeholder="Email"
                    variant="outlined"
                    error={Boolean(errors.email)}
                    helperText={errors.email?.message}
                    {...register('email')}
                  />
                </Box>
                <Box>
                  <Typography fontWeight={600} mb={1}>
                    Password
                  </Typography>
                  <TextField
                    fullWidth
                    type="password"
                    placeholder="Password"
                    variant="outlined"
                    error={Boolean(errors.password)}
                    helperText={errors.password?.message}
                    {...register('password')}
                  />
                </Box>
              </Box>

              <Grid item sm={6} xs={12} my={3}>
                <TextField fullWidth select label="Client Type" defaultValue="" required {...register('clientType')}>
                  <MenuItem value={ClientType.Customer}>Customer</MenuItem>
                  <MenuItem value={ClientType.Company}>Company</MenuItem>
                  <MenuItem value={ClientType.Administrator}>Administrator</MenuItem>
                </TextField>
              </Grid>

              <Box sx={{ mt: 3 }}>
                {loading ? (
                  <LoadingButton loading fullWidth variant="contained">
                    Loading
                  </LoadingButton>
                ) : (
                  <Button fullWidth type="submit" variant="contained">
                    Sign In
                  </Button>
                )}
              </Box>
            </form>
          </Box>
        </Card>
      </Box>
    </>
  );
}

export default Login;
