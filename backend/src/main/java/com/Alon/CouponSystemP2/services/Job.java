package com.Alon.CouponSystemP2.services;

import com.Alon.CouponSystemP2.entites.Coupon;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

/**
 * This class is responsible for running scheduled jobs on the Coupon System.
 * In particular, it runs a job every 12 hours to delete expired coupons from the system.
 * The deleteExpiredCoupons() method is annotated with @Scheduled and is scheduled to run every 12 hours using fixedRate.
 * The method retrieves all coupons whose end date is before the current date and deletes them from the system.
 * If any coupons were deleted, the method prints a message to the console with the list of deleted coupons.
 */
@Component
public class Job extends Services {

    @Scheduled(fixedRate = 43200000) // Runs every 12 hours.
    public void deleteExpiredCoupons() {
        List<Coupon> deletedCoupon = couponRepo.deleteByEndDateBefore(LocalDate.now());
        if (!deletedCoupon.isEmpty()) {
            System.out.println("Deleted Expired Coupons: ");
            deletedCoupon.forEach(System.out::println);
        }

    }

}
