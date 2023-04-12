package com.Alon.CouponSystemP2.services;

import com.Alon.CouponSystemP2.entites.Category;
import com.Alon.CouponSystemP2.entites.Company;
import com.Alon.CouponSystemP2.entites.Coupon;
import com.Alon.CouponSystemP2.exception.CouponSystemException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

import static com.Alon.CouponSystemP2.exception.ExceptionMessage.*;

@Service
@Transactional
public class CompanyService extends Services {

    public boolean login(String email, String password) {
        return companyRepo.existsByEmailAndPassword(email, password);
    }

    //GET

    /**
     * @param companyId int
     * @return List of all Company Coupons.
     * @throws CouponSystemException checks if Company exist by ID.
     */
    public List<Coupon> getCompanyAllCoupons(int companyId) throws CouponSystemException {
        if (!companyRepo.existsById(companyId)) {
            throw new CouponSystemException("Error: " + COMPANY_NOT_EXIST.getMessage());
        }
        List<Coupon> coupons = couponRepo.findByCompany(companyId);
        coupons.forEach(System.out::println);
        return coupons;
    }


    /**
     * @param companyEmail String
     * @return Company
     * @throws CouponSystemException checks if Company exist by email
     */
    public Company getCompanyByEmail(String companyEmail) throws CouponSystemException {
        return companyRepo.findByEmail(companyEmail)
                .orElseThrow(() -> new CouponSystemException("Error: " + COMPANY_NOT_EXIST.getMessage()));
    }

    /**
     * @param companyId int
     * @return Company
     * @throws CouponSystemException Checks if Company exist by ID.
     */
    public Company getOneCompany(int companyId) throws CouponSystemException {
        return this.companyRepo.findById(companyId)
                .orElseThrow(() -> new CouponSystemException("Error: " + COMPANY_NOT_EXIST.getMessage()));
    }

    /**
     * @param companyId int
     * @param category  Category
     * @return List of all Company Coupons with the same Category sorted by Category.
     * @throws CouponSystemException checks if Company exist by ID.
     */
    public List<Coupon> getCouponsByCompanyIdAndCategory(int companyId, Category category) throws CouponSystemException {
        if (!companyRepo.existsById(companyId)) {
            throw new CouponSystemException("Error: " + COMPANY_NOT_EXIST.getMessage());
        } else {
            return couponRepo.getCouponsByCompanyAndCategory(companyId, category);
        }

    }

    /**
     * @param companyId int
     * @param price     double
     * @return List of all Company Coupons by Price limit sorted by Price.
     * @throws CouponSystemException checks if Company exist by ID.
     */
    public List<Coupon> findByCompanyIdAndPriceLessThanEqual(int companyId, double price) throws CouponSystemException {
        if (!companyRepo.existsById(companyId)) {
            throw new CouponSystemException("Error: " + COMPANY_NOT_EXIST.getMessage());
        } else {
            List<Coupon> coupons = this.couponRepo.findByCompanyAndPriceLessThanEqual(companyId, price);
            coupons.sort(Comparator.comparing(Coupon::getPrice));
            coupons.forEach(System.out::println);
            return coupons;

        }
    }

    /**
     * @param couponId int
     * @return Coupon
     * @throws CouponSystemException checks if Coupon exist by ID
     */
    public Coupon getOneCoupon(int couponId) throws CouponSystemException {
        return this.couponRepo.findById(couponId)
                .orElseThrow(() -> new CouponSystemException("Error: " + COUPON_NOT_EXIST.getMessage()));
    }

    // ADD

    /**
     * @param coupon Constructor
     * @throws CouponSystemException checks if title already exist, in case exist checks if the Coupon owned by the same Company.
     *                               if yes throw exception, else add new Coupon.
     */
    public Coupon addCoupon(Coupon coupon) throws CouponSystemException {
        if (this.couponRepo.existsByTitle(coupon.getTitle())) {
            Coupon newCoupon = couponRepo.findByTitle(coupon.getTitle());

            if (coupon.getTitle().equals(newCoupon.getTitle()) && coupon.getCompany() == newCoupon.getCompany()) {
                throw new CouponSystemException(TITLE_ALREADY_EXIST.getMessage());
            }
        }
        return couponRepo.save(coupon);
    }

    // UPDATE

    /**
     * @param coupon constructor
     * @throws CouponSystemException check if exist by title. Cannot change Company / ID.
     */
    public Coupon updateCoupon(Coupon coupon) throws CouponSystemException {
        Coupon updateCoupon = couponRepo.findById(coupon.getId())
                .orElseThrow(() -> new CouponSystemException(COUPON_NOT_EXIST.getMessage()));
        if (updateCoupon.getCompany() != coupon.getCompany()) {
            throw new CouponSystemException(VALUE_CANNOT_BE_CHANGED.getMessage());
        } else {
            return couponRepo.save(coupon);
        }
    }

    // DELETE

    /**
     * @param couponId int
     * @throws CouponSystemException Checks if coupon exist by ID. delete coupon purchase from database
     *                               delete Coupon from coupons database.
     */
    public void deleteCoupon(int couponId) throws CouponSystemException {
        if (!this.couponRepo.existsById(couponId)) {
            throw new CouponSystemException("Error: " + COUPON_NOT_EXIST);
        } else {
            this.couponRepo.deleteCouponPurchase(couponId);
            this.couponRepo.deleteById(couponId);
            System.out.println("The Coupon has been deleted " + couponId);
        }
    }

}