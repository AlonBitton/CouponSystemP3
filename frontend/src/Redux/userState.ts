import UserModel from "models/UserModel";
import { createStore } from "redux";

export class UserState {
  public user: UserModel = null;
  public users: UserModel[] = [];

  public constructor() {}
}

export enum UserActionType {
  SetUser,
  UpdateUser,
}

export interface SetUserPayload {
  user: UserModel;
}

export interface UserAction {
  type: UserActionType;
  payload?: any;
}

export function userReducer(
  currentState = new UserState(),
  action: UserAction
): UserState {
  const newState = { ...currentState };

  switch (action.type) {
    case UserActionType.SetUser:
      newState.user = action.payload.user;
      break;
    case UserActionType.UpdateUser:
      newState.user = action.payload.user;
      break;
  }
  return newState;
}

export const userStore = createStore(userReducer);
