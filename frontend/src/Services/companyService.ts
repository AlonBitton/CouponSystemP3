import axios, { AxiosResponse } from 'axios';
import CouponModel from 'models/CouponModel';
import { toast } from 'react-toastify';
import appConfig from 'utils/appConfig';

class CompanyService {
  // Get
  public async getCompanyCoupons(): Promise<CouponModel[]> {
    try {
      const response: AxiosResponse<CouponModel[]> = await axios.get(appConfig.companyUrl + 'getCompanyCoupons');
      return response.data;
    } catch (error) {
      toast.error(error.response.data, { position: 'top-center', autoClose: 2000 });
    }
    return;
  }

  // Add
  public async addNewCoupon(coupon: CouponModel): Promise<void> {
    try {
      const response = await axios.post(appConfig.companyUrl + 'addNewCoupon', {
        category: coupon.category,
        title: coupon.title,
        description: coupon.description,
        startDate: coupon.startDate,
        endDate: coupon.endDate,
        amount: coupon.amount,
        price: coupon.price,
      });
      toast.success(response.data, { position: 'top-center', autoClose: 4000 });
      return response.data;
    } catch (error) {
      toast.error(error.response.data, { position: 'top-center', autoClose: 2000 });
    }
  }

  // Update
  public async updateCoupon(coupon: CouponModel): Promise<CouponModel> {
    try {
      const response = await axios.post(appConfig.companyUrl + 'updateCoupon', {
        id: coupon.id,
        category: coupon.category,
        title: coupon.title,
        description: coupon.description,
        startDate: coupon.startDate,
        endDate: coupon.endDate,
        amount: coupon.amount,
        price: coupon.price,
        image: coupon.image,
      });
      toast.success('Coupon has been updated!', { position: 'top-center', autoClose: 4000 });
      return response.data;
    } catch (error) {
      toast.error(error.response.data, { position: 'top-center', autoClose: 2000 });
    }
    return;
  }

  // Delete
  public async deleteCoupon(couponId: number): Promise<void> {
    try {
      const response = await axios.delete(appConfig.companyUrl + 'deleteCoupon?couponId=' + couponId);
      toast.success(response.data, { position: 'top-center', autoClose: 4000 });
      return response.data;
    } catch (error) {
      toast.error(error.response.data, { position: 'top-center', autoClose: 2000 });
    }
  }
}

const companyService = new CompanyService();

export default companyService;
