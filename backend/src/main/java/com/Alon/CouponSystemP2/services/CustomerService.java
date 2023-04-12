package com.Alon.CouponSystemP2.services;

import com.Alon.CouponSystemP2.entites.Coupon;
import com.Alon.CouponSystemP2.entites.Customer;
import com.Alon.CouponSystemP2.exception.CouponSystemException;
import com.Alon.CouponSystemP2.exception.ExceptionMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

import static com.Alon.CouponSystemP2.exception.ExceptionMessage.*;

@Service
@Transactional
public class CustomerService extends Services {

    @Autowired
    private CouponService couponService;

    public boolean login(String email, String password) {
        return customerRepo.existsByEmailAndPassword(email, password);
    }

    // GET

    /**
     * Returns the customer with the given email.
     *
     * @param customerEmail the email of the customer to retrieve.
     * @return the customer with the given email.
     * @throws CouponSystemException if no customer is found with the given email.
     */
    public Customer getCustomerByEmail(String customerEmail) throws CouponSystemException {
        return customerRepo.findByEmail(customerEmail)
                .orElseThrow(() -> new CouponSystemException("Error: " + CUSTOMER_NOT_EXIST.getMessage()));
    }

    /**
     * Retrieves all coupons belonging to the customer with
     * the specified customer ID from the Coupon System.
     *
     * @param customerId The ID of the customer whose coupons are being retrieved.
     * @return A list of all coupons belonging to the customer with the specified customer ID.
     * @throws CouponSystemException If no customer with the specified ID exists in the system.
     */
    public List<Coupon> getCustomerCoupons(int customerId) throws CouponSystemException {
        if (!customerRepo.existsById(customerId)) {
            throw new CouponSystemException(String.valueOf(CUSTOMER_NOT_EXIST.getMessage()));
        }
        return this.couponRepo.findByCustomerId(customerId);
    }

    /**
     * Retrieves all coupons from the Coupon System.
     *
     * @return A list of all coupons from the Coupon System.
     */
    public List<Coupon> getAllCoupons() {
        return couponRepo.findAll();
    }

    /**
     * Retrieves all coupons belonging to the customer
     * with the specified customer ID and having the specified category from the Coupon System.
     *
     * @param customerId The ID of the customer whose coupons are being retrieved.
     * @param category   The category of the coupons being retrieved.
     * @return A list of all coupons belonging to the customer with the specified customer ID
     * and having the specified category.
     * @throws CouponSystemException If no customer with the specified ID exists in the system.
     */
    public List<Coupon> getCouponsByCategoryAndCustomerId(int customerId, String category) throws CouponSystemException {
        if (!customerRepo.existsById(customerId)) {
            throw new CouponSystemException(String.valueOf(CUSTOMER_NOT_EXIST.getMessage()));
        }
        return this.couponRepo.getCouponsByCustomerIdAndCategory(customerId, category);
    }

    /**
     * Retrieves all coupons owned by a customer and with a price less than or equal to the given price.
     *
     * @param customerId the ID of the customer
     * @param price      the maximum price of the coupons to retrieve
     * @return a list of all coupons owned by the customer and with a price less than or equal to the given price
     * @throws CouponSystemException if the customer with the given ID does not exist
     */
    public List<Coupon> getCustomerIdAndPriceLessThanEqual(int customerId, double price) throws CouponSystemException {
        if (!customerRepo.existsById(customerId)) {
            throw new CouponSystemException(String.valueOf(CUSTOMER_NOT_EXIST.getMessage()));
        }
        return this.couponRepo.getCustomerCouponsByPrice(customerId, price);
    }

    // PURCHASE

    /**
     * Allows a customer to purchase a coupon, if it exists and meets certain criteria.
     *
     * @param customerId the id of the customer making the purchase
     * @param couponId   the id of the coupon being purchased
     * @throws CouponSystemException if the coupon does not exist, the coupon amount is zero, the coupon is expired,
     *                               markdown
     *                               Copy code
     *                               or the customer has already purchased the coupon
     */
    public void purchaseCoupon(int customerId, int couponId) throws CouponSystemException {
        if (!couponRepo.existsById(couponId)) {
            throw new CouponSystemException(COUPON_NOT_EXIST.getMessage());
        } else if (couponService.checkAmount(couponId) == 0) {
            throw new CouponSystemException(COUPON_AMOUNT_IS_ZERO.getMessage());
        } else if (couponService.checkExpirationDate(couponId).isBefore(LocalDate.now())) {
            throw new CouponSystemException(COUPON_EXPIRED.getMessage());
        } else if (couponRepo.checkIfHaveCoupon(customerId, couponId) == 1) {
            throw new CouponSystemException(COUPON_ALREADY_PURCHASED.getMessage());
        } else {
            customerRepo.addCouponPurchase(customerId, couponId);
            couponRepo.findById(couponId).get().setAmount(couponRepo.findById(couponId).get().getAmount() - 1);
        }
    }


}
