import CouponModel from 'models/CouponModel';
import { createStore } from 'redux';

export class CouponState {
  public coupon: CouponModel = null;
  public coupons: CouponModel[] = [];

  public constructor() {}
}

export enum CouponActionType {
  setCoupon,
  UpdateCoupon,
  GetAllCoupons,
}

export interface SetCouponPayload {
  coupon: CouponModel;
}

export interface CouponAction {
  type: CouponActionType;
  payload?: any;
}

export function couponReducer(currentState = new CouponState(), action: CouponAction): CouponState {
  const newState = { ...currentState };

  switch (action.type) {
    case CouponActionType.setCoupon:
      newState.coupon = action.payload.Coupon;
      break;
    case CouponActionType.UpdateCoupon:
      newState.coupons = action.payload.Coupon;
      break;
    case CouponActionType.GetAllCoupons:
      newState.coupons = action.payload;
  }
  return newState;
}

export const couponStore = createStore(couponReducer);
