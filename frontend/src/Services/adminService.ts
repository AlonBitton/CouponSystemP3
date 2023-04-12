import axios, { AxiosResponse } from 'axios';
import CouponModel from 'models/CouponModel';
import UserModel from 'models/UserModel';
import { toast } from 'react-toastify';
import appConfig from 'utils/appConfig';

class AdminService {




  // Get

  public async getAllCompanies(): Promise<UserModel[]> {
    try {
      const response: AxiosResponse<UserModel[]> = await axios.get(appConfig.adminUrl + 'getAllCompanies');
      return response.data;
    } catch (error) {
      toast.error(error.response.data, { position: 'top-center', autoClose: 2000 });
    }
    return;
  }

  public async getAllCustomers(): Promise<UserModel[]> {
    try {
      const response: AxiosResponse<UserModel[]> = await axios.get(appConfig.adminUrl + 'getAllCustomers');
      return response.data;
    } catch (error) {
      toast.error(error.response.data, { position: 'top-center', autoClose: 2000 });
    }
    return;
  }

  public async getAllCoupons(): Promise<CouponModel[]> {
    try {
      const response: AxiosResponse<CouponModel[]> = await axios.get(appConfig.adminUrl + 'getAllCoupons');
      return response.data;
    } catch (error) {
      toast.error(error.response.data, { position: 'top-center', autoClose: 2000 });
    }
    return;
  }

  // Add

  public async addNewCompany(company: UserModel): Promise<void> {
    const formData = new FormData();
    formData.append('email', company.email);
    formData.append('name', company.name);
    formData.append('password', company.password);
    try {
      const response = await axios.post(appConfig.adminUrl + 'addNewCompany', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success(response.data, { position: 'top-center', autoClose: 4000 });
    } catch (error) {
      toast.error(error.response.data, { position: 'top-center', autoClose: 2000 });
    }
    return;
  }

  public async addNewCustomer(user: UserModel): Promise<void> {
    const formData = new FormData();
    formData.append('firstName', user.firstName);
    formData.append('lastName', user.lastName);
    formData.append('email', user.email);
    formData.append('password', user.password);
    try {
      const response = await axios.post(appConfig.adminUrl + 'addNewCustomer', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success(response.data, { position: 'top-center', autoClose: 4000 });
    } catch (error) {
      toast.error(error.response.data, { position: 'top-center', autoClose: 2000 });
    }
    return;
  }

  public async addNewCoupon(coupon: CouponModel): Promise<void> {
    try {
      const response = await axios.post(appConfig.adminUrl + 'addNewCoupon', {
        category: coupon.category,
        title: coupon.title,
        description: coupon.description,
        startDate: coupon.startDate,
        endDate: coupon.endDate,
        amount: coupon.amount,
        price: coupon.price,
        company: coupon.companyId,
      });
      toast.success(response.data, { position: 'top-center', autoClose: 4000 });
      return response.data;
    } catch (error) {
      toast.error(error.response.data, { position: 'top-center', autoClose: 2000 });
    }
  }

  // Update

  public async updateCompany(user: UserModel): Promise<UserModel> {
    try {
      const response = await axios.post(appConfig.adminUrl + 'updateCompany', {
        id: user.id,
        name: user.name,
        email: user.email,
      });
      toast.success('Company has been updated!', { position: 'top-center', autoClose: 4000 });
      return response.data;
    } catch (error) {
      toast.error(error.response.data, { position: 'top-center', autoClose: 2000 });
    }
    return;
  }

  public async updateCustomer(user: UserModel): Promise<UserModel> {
    try {
      const response = await axios.post(appConfig.adminUrl + 'updateCustomer', {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      });
      toast.success('Customer has been updated!', { position: 'top-center', autoClose: 4000 });
      return response.data;
    } catch (error) {
      toast.error(error.response.data, { position: 'top-center', autoClose: 2000 });
    }
    return;
  }

  public async updateCoupon(coupon: CouponModel): Promise<CouponModel> {
    try {
      const response = await axios.post(appConfig.adminUrl + 'updateCoupon', {
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

  public async deleteCompany(companyId: number): Promise<void> {
    try {
      const response = await axios.delete(appConfig.adminUrl + 'deleteCompany?companyId=' + companyId);
      toast.success(response.data, { position: 'top-center', autoClose: 4000 });
      return response.data;
    } catch (error) {
      toast.error(error.response.data, { position: 'top-center', autoClose: 2000 });
    }
  }

  public async deleteCustomer(customerId: number): Promise<void> {
    try {
      const response = await axios.delete(appConfig.adminUrl + 'deleteCustomer?customerId=' + customerId);
      toast.success(response.data, { position: 'top-center', autoClose: 4000 });
      return response.data;
    } catch (error) {
      toast.error(error.response.data, { position: 'top-center', autoClose: 2000 });
    }
  }

  public async deleteCoupon(couponId: number): Promise<void> {
    try {
      const response = await axios.delete(appConfig.adminUrl + 'deleteCoupon?couponId=' + couponId);
      toast.success(response.data, { position: 'top-center', autoClose: 4000 });
      return response.data;
    } catch (error) {
      toast.error(error.response.data, { position: 'top-center', autoClose: 2000 });
    }
  }
  
}

const adminService = new AdminService();

export default adminService;
