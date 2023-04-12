import axios, { AxiosResponse } from 'axios';
import CouponModel from 'models/CouponModel';
import { toast } from 'react-toastify';
import { CouponActionType, couponStore } from 'Redux/couponsState';
import appConfig from 'utils/appConfig';

class CustomerService {
  public async getCustomerCoupons(): Promise<CouponModel[]> {
    try {
      const response: AxiosResponse<CouponModel[]> = await axios.get(appConfig.customerUrl + 'getCustomerCoupons');
      return response.data;
    } catch (error) {
      toast.error(error.response.data, { position: 'top-center', autoClose: 2000 });
    }

    return;
  }

  
  public async getAllCoupons(): Promise<CouponModel[]> {
    const response: AxiosResponse<CouponModel[]> = await axios.get(appConfig.customerUrl + 'getAllCoupons');
    const coupons = response.data;

    couponStore.dispatch({
      type: CouponActionType.GetAllCoupons,
      payload: {
        coupons,
      },
    });

    return response.data;
  }

  public async purchaseCoupon(couponId: number): Promise<void> {
    try {
      const response = await axios.post(appConfig.customerUrl + 'purchaseCoupon?couponId=' + couponId);
      toast.success(response.data, { position: 'top-center', autoClose: 4000 });
      return response.data;
    } catch (error) {
      toast.error(error.response.data, { position: 'top-center', autoClose: 2000 });
    }
    return;
  }
}

const customerService = new CustomerService();

export default customerService;
