package com.Alon.CouponSystemP2.controllers;

import com.Alon.CouponSystemP2.auth.CurrentUser;
import com.Alon.CouponSystemP2.auth.UserDetailsImpl;
import com.Alon.CouponSystemP2.entites.ClientType;
import com.Alon.CouponSystemP2.entites.Company;
import com.Alon.CouponSystemP2.entites.Coupon;
import com.Alon.CouponSystemP2.exception.CouponSystemException;
import com.Alon.CouponSystemP2.services.CompanyService;
import com.Alon.CouponSystemP2.services.CouponService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/api/company")
public class CompanyController {

    private static final Logger LOGGER = LoggerFactory.getLogger(CompanyController.class);
    @Autowired
    private CompanyService companyService;
    @Autowired
    private CouponService couponService;

    // Get

    /**
     * Handles the GET request for getting all the Coupons of a Company.
     * It is mapped to '/api/company/getCompanyCoupons' URL and returns a List of Coupons.
     *
     * @param userDetails the UserDetailsImpl object representing the currently logged-in User.
     * @return a ResponseEntity containing either the List of Coupons or an error message and the corresponding HttpStatus code.
     */
    @GetMapping("/getCompanyCoupons")
    public ResponseEntity<?> getCompanyCoupons(@CurrentUser UserDetailsImpl userDetails) {
        int companyId = userDetails.getId();
        try {
            List<Coupon> couponList = this.companyService.getCompanyAllCoupons(companyId);
            if (couponList.isEmpty()) {
                return new ResponseEntity<>("Coupons not found", HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(couponList, HttpStatus.OK);
        } catch (CouponSystemException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Add

    /**
     * Handles the POST request for adding a new Coupon for a Company.
     * It is mapped to '/api/company/addNewCoupon' URL and returns a message indicating whether the Coupon was added or not.
     * *
     *
     * @param userDetails the UserDetailsImpl object representing the currently logged-in User.
     * @param coupon      the Coupon object to be added.
     * @return a ResponseEntity containing either a success message or an error message and the corresponding HttpStatus code.
     */
    @PreAuthorize("hasAuthority('Company')")
    @PostMapping(value = "/addNewCoupon")
    public ResponseEntity<?> addNewCoupon(@CurrentUser UserDetailsImpl userDetails, @RequestBody Coupon coupon) {
        ClientType clientType = userDetails.getClientType();

        try {
            Company company = companyService.getCompanyByEmail(userDetails.getEmail());
            coupon.setCompany(company.getId());

            if (!clientType.equals(ClientType.Company)) {
                return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);
            }
            if (coupon.getCompany() == 0) {
                return new ResponseEntity<>("Company ID cannot be 0 ", HttpStatus.BAD_REQUEST);
            }

            Coupon newCoupon = this.companyService.addCoupon(coupon);
            LOGGER.trace("New coupon has been added: {}", newCoupon.getId());
            return new ResponseEntity<>("Coupon has been added", HttpStatus.OK);
        } catch (CouponSystemException e) {
            LOGGER.error(e.getMessage() + "Trying to add new Coupon by ID: {}", userDetails.getId());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Update

    /**
     * Handles the POST request for updating a Coupon of a Company.
     * It is mapped to '/api/company/updateCoupon' URL and returns either the updated Coupon or an error message.
     *
     * @param userDetails the UserDetailsImpl object representing the currently logged-in User.
     * @param coupon      the Coupon object to be updated.
     * @param image       the MultipartFile representing the image of the Coupon.
     * @return a ResponseEntity containing either the updated Coupon or an error message
     */
    @PostMapping(value = "/updateCoupon")
    public ResponseEntity<?> updateCoupon(@CurrentUser UserDetailsImpl userDetails, @RequestBody Coupon coupon, @RequestParam("image") MultipartFile image) {
        LOGGER.debug("Trying to update Coupon by @{}", userDetails.getEmail());
        ClientType clientType = userDetails.getClientType();
        try {
            if (!clientType.equals(ClientType.Company)) {
                return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);
            }
            Coupon toUpdateCoupon = companyService.getOneCoupon(coupon.getId());

            toUpdateCoupon.setCategory(coupon.getCategory());
            toUpdateCoupon.setTitle(coupon.getTitle());
            toUpdateCoupon.setDescription(coupon.getDescription());
            toUpdateCoupon.setStartDate(coupon.getStartDate());
            toUpdateCoupon.setEndDate(coupon.getEndDate());
            toUpdateCoupon.setAmount(coupon.getAmount());
            toUpdateCoupon.setPrice(coupon.getPrice());
            toUpdateCoupon.setImage(coupon.getImage());


            Coupon updateCoupon = companyService.updateCoupon(toUpdateCoupon);
            LOGGER.trace("Coupon has been updated: {}", updateCoupon.toString());
            return new ResponseEntity<>(updateCoupon, HttpStatus.OK);

        } catch (CouponSystemException e) {
            LOGGER.error(e.getMessage() + "Trying to update Coupon by ID: {}", userDetails.getId());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Delete

    /**
     * Handle the Delete request for a coupon with the specified ID for the current company.
     *
     * @param userDetails the current user details.
     * @param couponId    the ID of the coupon to be deleted.
     * @return a ResponseEntity object indicating success or failure of the operation.
     */
    @PreAuthorize("hasAuthority('Company')")
    @DeleteMapping(value = "/deleteCoupon")
    public ResponseEntity<?> deleteCoupon(@CurrentUser UserDetailsImpl userDetails, @RequestParam int couponId) {
        LOGGER.debug("Trying to delete Coupon by @{}", userDetails.getEmail());
        ClientType clientType = userDetails.getClientType();

        try {
            if (!clientType.equals(ClientType.Company)) {
                return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);
            }
            companyService.deleteCoupon(couponId);
            LOGGER.trace("Coupon has been deleted: By: {}, CouponId: {}", userDetails.getEmail(), couponId);
            return new ResponseEntity<>("Coupon has been deleted!", HttpStatus.OK);

        } catch (CouponSystemException e) {
            LOGGER.error(e.getMessage() + "Trying to delete Coupon by ID: {}", userDetails.getId());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }


}
