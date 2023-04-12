/**
 * This module contains the AuthState class, AuthActionType enum, and AuthAction interface.
 * Also included is the authReducer function which handles authentication-related state changes,
 * and extractUser function which extracts the user from a JWT token.
 *
 * @packageDocumentation
 */

import jwtDecode from 'jwt-decode';
import { createStore } from 'redux';
import UserModel from 'models/UserModel';
import ClientType from 'models/ClientType';
import { useSelector } from 'react-redux';

/**
 * AuthState class represents the current state of the authentication status.
 *
 * @public
 */
export class AuthState {
  public user: UserModel = null;
  public token: string = null;

  public constructor() {
    this.token = localStorage.getItem('token');
    if (this.token) {
      this.user = extractUser(this.token);
    }
  }
}

export enum AuthActionType {
  Login,
  Logout,
}

/**
 * Authentication action interface.
 *
 * @public
 */
export interface AuthAction {
  type: AuthActionType;
  payload?: string;
}


/**
 * AuthReducer function is responsible for managing the state of the authentication-related data.
 *
 * @param currentState - Current authentication state
 * @param action - Authentication action to perform
 * @returns Authentication state after performing the action
 *
 * @public
 */
export function authReducer(currentState = new AuthState(), action: AuthAction): AuthState {
  const newState = { ...currentState };

  switch (action.type) {
    case AuthActionType.Login:
      newState.token = action.payload;
      newState.user = extractUser(newState.token);
      localStorage.setItem('token', newState.token);
      break;
    case AuthActionType.Logout:
      newState.token = null;
      newState.user = null;
      localStorage.removeItem('token');
      break;
  }

  return newState;
}

/**
 * Extracts the user from a JWT token.
 *
 * @param token - JWT token containing the user information
 * @returns UserModel containing the user information extracted from the JWT token
 *
 * @private
 */
function extractUser(token: string): UserModel {
  let user: UserModel;
  const container: any = jwtDecode(token);
  if (container) {
    const clientType: ClientType = container.clientType;

    switch (clientType) {
      case ClientType.Customer:
        user = new UserModel(
          container.clientType,
          container.email,
          container.password,
          container.firstName,
          container.lastName,
        );
        break;
      case ClientType.Company:
        user = new UserModel(container.clientType, container.email, container.name, container.password);
        break;
      case ClientType.Administrator:
        user = new UserModel(container.clientType, container.email, container.password);
        break;
    }
  }
  return user;
}
export const authStore = createStore(authReducer);
