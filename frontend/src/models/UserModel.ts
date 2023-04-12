import CouponModel from './CouponModel';

class UserModel {
  public id: number;
  public clientType: string;
  public email: string;
  public password: string;
  public name: string;
  public firstName: string;
  public lastName: string;
  public coupons: CouponModel[];

  public constructor(
    clientType: string,
    email: string,
    password: string,
    firstName?: string,
    lastName?: string,
    name?: string,
    coupons?: CouponModel[],
  ) {
    this.clientType = clientType;
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.name = name;
    this.coupons = coupons;
  }
}

export default UserModel;
