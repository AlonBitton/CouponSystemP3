import axios, { AxiosResponse } from 'axios';
import CredentialsModel from 'models/CredentialsModel';
import { toast } from 'react-toastify';
import { AuthActionType, authStore } from 'Redux/authState';
import appConfig from 'utils/appConfig';

class AuthService {
  // Login
  public async login(credentials: CredentialsModel): Promise<any> {
    try {
      const response: AxiosResponse<any> = await axios.post(appConfig.loginUrl + 'login', credentials, {
        params: { clientType: credentials.clientType },
      });
      const token = response.data;
      authStore.dispatch({ type: AuthActionType.Login, payload: token });
      toast.success('You have been authenticated, being redirected to Home page', {
        position: 'top-center',
        autoClose: 1500,
      });
      return response.data;
    } catch (error) {
      toast.error(error.response.data.message, { position: 'top-center', autoClose: 2000 });
    }
    return;
  }

  // Logout:
  public logout(): void {
    authStore.dispatch({ type: AuthActionType.Logout });
  }
}

const authService = new AuthService();

export default authService;
