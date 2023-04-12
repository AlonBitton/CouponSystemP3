package com.Alon.CouponSystemP2.controllers;

import com.Alon.CouponSystemP2.auth.CurrentUser;
import com.Alon.CouponSystemP2.auth.UserDetailsImpl;
import com.Alon.CouponSystemP2.entites.Coupon;
import com.Alon.CouponSystemP2.entites.Customer;
import com.Alon.CouponSystemP2.exception.CouponSystemException;
import com.Alon.CouponSystemP2.services.CustomerService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.Alon.CouponSystemP2.exception.ExceptionMessage.COUPON_NOT_EXIST;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/api/customer")
public class CustomerController {

    private static final Logger LOGGER = LoggerFactory.getLogger(CustomerController.class);
    @Autowired
    private CustomerService customerService;

    // GET

    /**
     * Retrieves a list of all the coupons purchased by the current customer.
     *
     * @param userDetails details of the currently authenticated user
     * @return a response entity containing a list of coupons or an error message
     */
    @GetMapping("/getCustomerCoupons")
    public ResponseEntity<?> getCustomerCoupons(@CurrentUser UserDetailsImpl userDetails) {

        try {
            Customer customer = customerService.getCustomerByEmail(userDetails.getEmail());

            List<Coupon> couponList = customerService.getCustomerCoupons(customer.getId());

            if (couponList.isEmpty()) {
                return new ResponseEntity<>("No coupons found!", HttpStatus.NOT_FOUND);
            }

            return new ResponseEntity<>(couponList, HttpStatus.OK);

        } catch (CouponSystemException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }

    }

    /**
     * Retrieves a list of all available coupons.
     *
     * @return a response entity containing a list of coupons or an error message
     */
    @GetMapping("/getAllCoupons")
    public ResponseEntity<?> getAllCoupons() {
        LOGGER.debug("Loading all Coupons");
        List<Coupon> allCoupons = customerService.getAllCoupons();
        if (allCoupons.isEmpty()) {
            return new ResponseEntity<>(COUPON_NOT_EXIST.getMessage(), HttpStatus.NOT_FOUND);
        }
        LOGGER.error("Error Loading all Coupons - not found");
        return new ResponseEntity<>(allCoupons, HttpStatus.OK);
    }

    // Purchase

    /**
     * Purchases a coupon for the current customer.
     *
     * @param userDetails details of the currently authenticated user
     * @param couponId    the ID of the coupon to purchase
     * @return a response entity with a success message or an error message
     */
    @PostMapping("/purchaseCoupon")
    public ResponseEntity<?> purchaseCoupon(@CurrentUser UserDetailsImpl userDetails, @RequestParam int couponId) {
        try {
            Customer customer = customerService.getCustomerByEmail(userDetails.getEmail());
            customerService.purchaseCoupon(customer.getId(), couponId);
            return new ResponseEntity<>("Coupon has been purchased", HttpStatus.OK);
        } catch (CouponSystemException e) {
            LOGGER.error(e.getMessage() + " Trying to purchase Coupon by ID: {}", userDetails.getId(), "CouponID", couponId);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }


}
