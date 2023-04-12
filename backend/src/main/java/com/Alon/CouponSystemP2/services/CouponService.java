package com.Alon.CouponSystemP2.services;

import com.Alon.CouponSystemP2.exception.CouponSystemException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

import static com.Alon.CouponSystemP2.exception.ExceptionMessage.COUPON_NOT_EXIST;

@Service
@Transactional
public class CouponService extends Services {

    // CHECK

    /**
     * Check the amount of a coupon by its ID.
     *
     * @param couponId the ID of the coupon to check
     * @return the amount of the coupon
     * @throws CouponSystemException if the coupon with the specified ID doesn't exist
     */
    public int checkAmount(int couponId) throws CouponSystemException {
        if (!this.couponRepo.existsById(couponId)) {
            throw new CouponSystemException("Error: " + COUPON_NOT_EXIST.getMessage());
        } else {
            return this.couponRepo.findById(couponId).get().getAmount();
        }
    }

    /**
     * Check the expiration date of a coupon by its ID.
     *
     * @param couponId the ID of the coupon to check
     * @return the expiration date of the coupon
     * @throws CouponSystemException if the coupon with the specified ID doesn't exist
     */
    public LocalDate checkExpirationDate(int couponId) throws CouponSystemException {
        if (!this.couponRepo.existsById(couponId)) {
            throw new CouponSystemException("Error: " + COUPON_NOT_EXIST.getMessage());
        } else {
            return this.couponRepo.findById(couponId).get().getEndDate();
        }
    }


}