/**
 * This class handles the creation of axios interceptors for authentication and authorization purposes.
 * It includes an interceptor for requests that adds the authorization header with the JWT token from the authStore,
 * and an interceptor for responses that redirects the user to the login page if the backend responds with a 401 or 403 status code.
 */

import axios from 'axios';
import { authStore } from '../Redux/authState';

class Interceptors {
  public create(): void {
    // On any request this function will be called:
    axios.interceptors.request.use(requestObject => {
      // return token if exist
      if (authStore.getState().token) {

        requestObject.headers.Authorization = 'Bearer ' + authStore.getState().token;
      }

      return requestObject;
    });

    // Add interceptor for responses
    axios.interceptors.response.use(responseObject => {
      if (responseObject.status === 401 || responseObject.status === 403) {
        //Redirect to login
        window.location.href = '/login';
      }
      return responseObject;
    });
  }
}

const interceptors = new Interceptors();

export default interceptors;
