package com.Alon.CouponSystemP2.controllers;

import com.Alon.CouponSystemP2.auth.CurrentUser;
import com.Alon.CouponSystemP2.auth.UserDetailsImpl;
import com.Alon.CouponSystemP2.entites.ClientType;
import com.Alon.CouponSystemP2.entites.Company;
import com.Alon.CouponSystemP2.entites.Customer;
import com.Alon.CouponSystemP2.exception.CouponSystemException;
import com.Alon.CouponSystemP2.services.CompanyService;
import com.Alon.CouponSystemP2.services.CustomerService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/api/user")
public class UserController {
    private static final Logger LOGGER = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private CustomerService customerService;
    @Autowired
    private CompanyService companyService;


    /**
     Returns the details of the currently authenticated user.
     @param userDetails The authenticated user's details.
     @return The details of the authenticated user.
     */
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/getUserDetails")
    public ResponseEntity<?> getUserDetails(@CurrentUser UserDetailsImpl userDetails) {

        ClientType clientType = userDetails.getClientType();
        String email = userDetails.getEmail();

        try {
            switch (clientType) {
                case Customer -> {
                    LOGGER.debug("Loading customer by email: {}", email);
                    Customer customer = customerService.getCustomerByEmail(email);
                    return new ResponseEntity<>(customer, HttpStatus.OK);

                }
                case Company -> {
                    LOGGER.debug("Loading company by email: {}", email);
                    Company company = companyService.getCompanyByEmail(email);
                    return new ResponseEntity<>(company, HttpStatus.OK);

                }
                case Administrator -> {
                    LOGGER.debug("Loading administrator");
                    Customer customer = Customer.builder().firstName("Admin").lastName("Admin").email("admin@admin.com").password("admin").build();
                    return new ResponseEntity<>(customer, HttpStatus.OK);
                }
            }

        } catch (CouponSystemException e) {
            LOGGER.error("Error loading user by email and client type: {}", e.getMessage());
            return new ResponseEntity<>("Error loading user by email and client type: " + e.getMessage(), HttpStatus.UNPROCESSABLE_ENTITY);
        }

        LOGGER.error("No user found with email: {} and client type: {}", email, clientType);
        return new ResponseEntity<>("No user found with email: " + email + " and client type: " + clientType, HttpStatus.BAD_REQUEST);
    }

}
