package com.Alon.CouponSystemP2.controllers;

import com.Alon.CouponSystemP2.auth.CurrentUser;
import com.Alon.CouponSystemP2.auth.UserDetailsImpl;
import com.Alon.CouponSystemP2.entites.ClientType;
import com.Alon.CouponSystemP2.entites.Company;
import com.Alon.CouponSystemP2.entites.Coupon;
import com.Alon.CouponSystemP2.entites.Customer;
import com.Alon.CouponSystemP2.exception.CouponSystemException;
import com.Alon.CouponSystemP2.repositories.CouponRepo;
import com.Alon.CouponSystemP2.services.AdminService;
import com.Alon.CouponSystemP2.services.CompanyService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

import static com.Alon.CouponSystemP2.exception.ExceptionMessage.*;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/api/admin")
public class AdminController {

    private static final Logger LOGGER = LoggerFactory.getLogger(AdminController.class);
    @Autowired
    private AdminService adminService;
    @Autowired
    private CompanyService companyService;
    @Autowired
    private CouponRepo couponRepo;

    // Get
    /**
     * This method retrieves all the companies from the database.
     * If there are no companies in the database, an error message is returned.
     *
     * @return - Returns a ResponseEntity with all the companies in the database or an error message if there are no companies.
     */
    @GetMapping("/getAllCompanies")
    public ResponseEntity<?> getAllCompanies() {
        LOGGER.debug("Loading all Companies");
        List<Company> allCompanies = this.adminService.getAllCompanies();
        if (!allCompanies.isEmpty()) {
            return new ResponseEntity<>(allCompanies, HttpStatus.OK);
        }
        LOGGER.error("Error Loading all Companies, not found");
        return new ResponseEntity<>(COMPANY_NOT_EXIST.getMessage(), HttpStatus.NOT_FOUND);
    }

    /**
     * This method retrieves all the customers from the database.
     * If there are no customers in the database, an error message is returned.
     *
     * @return - Returns a ResponseEntity with all the customers in the database or an error message if there are no customers.
     */
    @GetMapping("/getAllCustomers")
    public ResponseEntity<?> getAllCustomers() {
        LOGGER.debug("Loading all Customers");
        List<Customer> allCustomers = this.adminService.getAllCustomers();
        if (!allCustomers.isEmpty()) {
            return new ResponseEntity<>(allCustomers, HttpStatus.OK);
        }
        LOGGER.error("Error Loading all Customers, not found");
        return new ResponseEntity<>(CUSTOMER_NOT_EXIST.getMessage(), HttpStatus.NOT_FOUND);
    }

    /**
     * This method retrieves all the coupons from the database.
     * If there are no coupons in the database, an error message is returned.
     *
     * @return - Returns a ResponseEntity with all the coupons in the database or an error message if there are no coupons.
     */
    @GetMapping("/getAllCoupons")
    public ResponseEntity<?> getAllCoupons() {
        LOGGER.debug("Loading all Coupons");
        List<Coupon> allCoupons = adminService.getAllCoupons();
        if (!allCoupons.isEmpty()) {
            return new ResponseEntity<>(allCoupons, HttpStatus.OK);
        }
        LOGGER.error("Error Loading all Coupons - not found");
        return new ResponseEntity<>(COUPON_NOT_EXIST.getMessage(), HttpStatus.NOT_FOUND);
    }

    // Add
    /**
     * This method adds a new company to the database.
     * The method requires the admin user to be authenticated and authorized.
     * If the company already exists in the database, an error message is returned.
     *
     * @param userDetails - The authenticated user details.
     * @param company     - The new company to be added to the database.
     * @return - Returns a ResponseEntity indicating whether the company has been added or an error message.
     */
    @PreAuthorize("hasAuthority('Administrator')")
    @PostMapping(value = "/addNewCompany", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> addNewCompany(@CurrentUser UserDetailsImpl userDetails, @ModelAttribute Company company) {
        LOGGER.debug("Trying to add new Customer by @{}", userDetails.getEmail());
        ClientType clientType = userDetails.getClientType();
        if (!clientType.equals(ClientType.Administrator)) {
            return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);
        }
        try {
            // If there is a Company exist by the same email/name AdminService will return an exception
            Company newCompany = this.adminService.addCompany(company);
            LOGGER.trace("New Company has been added: {}", newCompany.toString());
            return new ResponseEntity<>("Company has been added", HttpStatus.OK);
        } catch (CouponSystemException e) {
            LOGGER.error(e.getMessage() + "Trying to add new Company by ID: {}", userDetails.getId());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * This method adds a new customer to the database.
     * The method requires the admin user to be authenticated and authorized.
     * If the customer already exists in the database, an error message is returned.
     *
     * @param userDetails - The authenticated user details.
     * @param customer    - The new customer to be added to the database.
     * @return - Returns a ResponseEntity indicating whether the customer has been added or an error message.
     */
    @PreAuthorize("hasAuthority('Administrator')")
    @PostMapping(value = "/addNewCustomer", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> addNewCustomer(@CurrentUser UserDetailsImpl userDetails, @ModelAttribute Customer customer) {
        LOGGER.debug("Trying to add new Customer by @{}", userDetails.getEmail());
        ClientType clientType = userDetails.getClientType();
        if (!clientType.equals(ClientType.Administrator)) {
            return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);
        }
        try {
            // If there is a Customer exist by the same email AdminService will return an exception
            Customer newCustomer = this.adminService.addCustomer(customer);
            LOGGER.trace("New customer has been added: {}", newCustomer.toString());
            return new ResponseEntity<>("Customer has been added", HttpStatus.OK);
        } catch (CouponSystemException e) {
            LOGGER.error(e.getMessage() + "Trying to add new Customer by ID: {}", userDetails.getId());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }

    }

    /**
     * This method adds a new coupon to the database.
     * The method requires the admin user to be authenticated and authorized.
     * If the company ID is 0, an error message is returned.
     *
     * @param userDetails - The authenticated user details.
     * @param coupon      - The new coupon to be added to the database.
     * @return - Returns a ResponseEntity indicating whether the coupon has been added or an error message.
     */
    @PreAuthorize("hasAuthority('Administrator')")
    @PostMapping(value = "/addNewCoupon")
    public ResponseEntity<?> addNewCoupon(@CurrentUser UserDetailsImpl userDetails, @RequestBody Coupon coupon) {
        ClientType clientType = userDetails.getClientType();
        try {
            if (!clientType.equals(ClientType.Administrator)) {
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
     * This method updates a company in the database.
     * The method requires the admin user to be authenticated and authorized.
     * If the updated email already exists in the database, an error message is returned.
     *
     * @param userDetails - The authenticated user details.
     * @param company     - The company to be updated in the database.
     * @return - Returns a ResponseEntity indicating whether the company has been updated or an error message.
     */
    @PreAuthorize("hasAuthority('Administrator')")
    @PostMapping(value = "/updateCompany")
    public ResponseEntity<?> updateCompany(@CurrentUser UserDetailsImpl userDetails, @RequestBody Company company) {
        LOGGER.debug("Trying to update Company by @{}", userDetails.getEmail());
        try {
            Company toUpdateCompany = adminService.getOneCompany(company.getId());
            // Checks if the body email is not match curr company email: if not match check if already exist, else continue
            if (!Objects.equals(company.getEmail(), toUpdateCompany.getEmail())) {
                Company emailValidation = adminService.getCompanyByEmail(company.getEmail());
                if (emailValidation != null) {
                    return new ResponseEntity<>(EMAIL_ALREADY_EXIST.getMessage(), HttpStatus.BAD_REQUEST);
                }
                toUpdateCompany.setEmail(company.getEmail());
            }

            toUpdateCompany.setName(company.getName());

            Company updateCompany = adminService.updateCompany(toUpdateCompany);
            LOGGER.trace("Company has been updated: {}", updateCompany.toString());
            return new ResponseEntity<>(updateCompany, HttpStatus.OK);

        } catch (CouponSystemException e) {
            LOGGER.error(e.getMessage() + "Trying to update Company by ID: {}", userDetails.getId());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * This method updates a customer in the database.
     * The method requires the admin user to be authenticated and authorized.
     * If the updated email already exists in the database, an error message is returned.
     *
     * @param userDetails - The authenticated user details.
     * @param customer    - The customer to be updated in the database.
     * @return - Returns a ResponseEntity indicating whether the customer has been updated or an error message.
     */
    @PostMapping(value = "/updateCustomer")
    public ResponseEntity<?> updateCustomer(@CurrentUser UserDetailsImpl userDetails, @RequestBody Customer customer) {
        LOGGER.debug("Trying to update Customer by @{}", userDetails.getEmail());
        try {
            Customer toUpdateCustomer = adminService.getOneCustomer(customer.getId());

            // Checks if the body email is not match curr customer email: if not match check if already exist, else continue
            if (!Objects.equals(customer.getEmail(), toUpdateCustomer.getEmail())) {
                Customer emailValidation = adminService.getCustomerByEmail(customer.getEmail());
                if (emailValidation != null) {
                    return new ResponseEntity<>(EMAIL_ALREADY_EXIST.getMessage(), HttpStatus.BAD_REQUEST);
                }
                toUpdateCustomer.setEmail(customer.getEmail());
            }
            toUpdateCustomer.setFirstName(customer.getFirstName());
            toUpdateCustomer.setLastName(customer.getLastName());

            Customer updateCustomer = adminService.updateCustomer(toUpdateCustomer);
            LOGGER.trace("Customer has been updated: {}", updateCustomer.toString());
            return new ResponseEntity<>(updateCustomer, HttpStatus.OK);
        } catch (CouponSystemException e) {
            LOGGER.error(e.getMessage() + "Trying to update Customer by ID: {}", userDetails.getId());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }


    }

    /**
     * This method updates a coupon in the database.
     * The method requires the admin user to be authenticated and authorized.
     *
     * @param userDetails - The authenticated user details.
     * @param coupon      - The coupon to be updated in the database.
     * @return - Returns a ResponseEntity indicating whether the coupon has been updated or an error message.
     */
    @PostMapping(value = "/updateCoupon")
    public ResponseEntity<?> updateCoupon(@CurrentUser UserDetailsImpl userDetails, @RequestBody Coupon coupon) {
        LOGGER.debug("Trying to update Coupon by @{}", userDetails.getEmail());
        try {
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
     * This method deletes a company from the database.
     * The method requires the admin user to be authenticated and authorized.
     *
     * @param userDetails - The authenticated user details.
     * @param companyId   - The ID of the company to be deleted.
     * @return - Returns a ResponseEntity indicating whether the company has been deleted or an error message.
     */
    @PreAuthorize("hasAuthority('Administrator')")
    @DeleteMapping(value = "/deleteCompany")
    public ResponseEntity<?> deleteCompany(@CurrentUser UserDetailsImpl userDetails, @RequestParam int companyId) {
        LOGGER.debug("Trying to delete Company by @{}", userDetails.getEmail());
        ClientType clientType = userDetails.getClientType();

        try {
/*            if (!clientType.equals(ClientType.Administrator)) {
                return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);
            }*/

            adminService.deleteCompany(companyId);
            LOGGER.trace("Company has been deleted: By: {}, CompanyId: {}", userDetails.getEmail(), companyId);
            return new ResponseEntity<>("Company has been deleted!", HttpStatus.OK);

        } catch (CouponSystemException e) {
            LOGGER.error(e.getMessage() + "Trying to delete Company by ID: {}", userDetails.getId());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * This method deletes a customer from the database.
     * The method requires the admin user to be authenticated and authorized.
     *
     * @param userDetails - The authenticated user details.
     * @param customerId  - The ID of the customer to be deleted.
     * @return - Returns a ResponseEntity indicating whether the customer has been deleted or an error message.
     */
    @PreAuthorize("hasAuthority('Administrator')")
    @DeleteMapping(value = "/deleteCustomer")
    public ResponseEntity<?> deleteCustomer(@CurrentUser UserDetailsImpl userDetails, @RequestParam int customerId) {
        LOGGER.debug("Trying to delete Customer by @{}", userDetails.getEmail());
        ClientType clientType = userDetails.getClientType();

        try {
            if (!clientType.equals(ClientType.Administrator)) {
                return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);
            }
            adminService.deleteCustomer(customerId);
            LOGGER.trace("Customer has been deleted: By: {}, CustomerID: {}", userDetails.getEmail(), customerId);
            return new ResponseEntity<>("Customer has been deleted!", HttpStatus.OK);

        } catch (CouponSystemException e) {
            LOGGER.error(e.getMessage() + "Trying to delete Customer by ID: {}", userDetails.getId());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * This method is used to delete a coupon from the system.
     *
     * @param userDetails The details of the authenticated user.
     * @param couponId     The ID of the coupon to be deleted.
     * @return A ResponseEntity containing a success message and a success status code,
     *         or an error message and a corresponding error status code if an error occurred.
     */
    @PreAuthorize("hasAuthority('Administrator')")
    @DeleteMapping(value = "/deleteCoupon")
    public ResponseEntity<?> deleteCoupon(@CurrentUser UserDetailsImpl userDetails, @RequestParam int couponId) {
        LOGGER.debug("Trying to delete Coupon by @{}", userDetails.getEmail());
        ClientType clientType = userDetails.getClientType();

        try {
            if (!clientType.equals(ClientType.Administrator)) {
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

