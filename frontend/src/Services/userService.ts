import axios from 'axios';
import UserModel from 'models/UserModel';
import { UserActionType, userStore } from 'Redux/userState';
import appConfig from 'utils/appConfig';

class UserService {

  public async getUserDetails(): Promise<void> {
    const response = await axios.get<UserModel>(appConfig.userUrl + 'getUserDetails');
    const user = response.data;

    userStore.dispatch({
      type: UserActionType.SetUser,
      payload: {
        user,
      },
    });
  }
}

const userService = new UserService();

export default userService;
