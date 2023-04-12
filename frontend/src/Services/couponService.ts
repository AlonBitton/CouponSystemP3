import axios, { AxiosResponse } from 'axios';
import CouponModel from 'models/CouponModel';
import { CouponActionType, couponStore } from 'Redux/couponsState';
import appConfig from 'utils/appConfig';

class CouponService {


  public async getAllCoupons(): Promise<CouponModel[]> {
    const response: AxiosResponse<CouponModel[]> = await axios.get(appConfig.adminUrl + 'getAllCoupons');
    const coupons = response.data;

    couponStore.dispatch({
      type: CouponActionType.GetAllCoupons,
      payload: {
        coupons,
      },
    });

    return response.data;
  }
}

const couponService = new CouponService();

export default couponService;
