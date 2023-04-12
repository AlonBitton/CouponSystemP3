package com.Alon.CouponSystemP2.services;

import com.Alon.CouponSystemP2.entites.Company;
import com.Alon.CouponSystemP2.entites.Coupon;
import com.Alon.CouponSystemP2.entites.Customer;
import com.Alon.CouponSystemP2.exception.CouponSystemException;
import com.Alon.CouponSystemP2.exception.ExceptionMessage;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
@Transactional
public class AdminService extends Services {

    // Set hard-coded admin credentials
    public static final String adminEmail = "admin@admin.com";
    public static final String adminPassword = "admin";

    public boolean login(String email, String password) {
        return adminEmail.equals(email) && adminPassword.equals(password);
    }

    // GET

    /**
     * Retrieves a list of all the companies in the system.
     *
     * @return a list of all the companies in the system.
     */
    public List<Company> getAllCompanies() {
        List<Company> companies = companyRepo.findAll();
        companies.sort(Comparator.comparing(Company::getId));
        return companies;
    }

    /**
     * Retrieves a single company by its ID.
     *
     * @param companyId the ID of the company to retrieve.
     * @return the company with the specified ID.
     * @throws CouponSystemException if the company does not exist in the system.
     */
    public Company getOneCompany(int companyId) throws CouponSystemException {
        return this.companyRepo.findById(companyId)
                .orElseThrow(() -> new CouponSystemException("Error: " + ExceptionMessage.COMPANY_NOT_EXIST.getMessage()));
    }

    /**
     * Gets a company by its email.
     *
     * @param email the email of the company to get.
     * @return the company with the specified email, or null if not found.
     */
    public Company getCompanyByEmail(String email) throws CouponSystemException {
        return this.companyRepo.findByEmail(email).orElse(null);
    }

    /**
     * Gets all the customers in the Coupon System.
     *
     * @return a list of all customers in the Coupon System, sorted by their ID.
     */
    public List<Customer> getAllCustomers() {
        List<Customer> customers = customerRepo.findAll();
        customers.sort(Comparator.comparing(Customer::getId));
        return customers;
    }

    /**
     * Gets a customer by its ID.
     *
     * @param customerId the ID of the customer to get.
     * @return the customer with the specified ID.
     * @throws CouponSystemException if the customer with the specified ID does not exist in the system.
     */
    public Customer getOneCustomer(int customerId) throws CouponSystemException {
        return customerRepo.findById(customerId)
                .orElseThrow(() -> new CouponSystemException("Error: " + ExceptionMessage.CUSTOMER_NOT_EXIST.getMessage()));
    }

    /**
     * Gets a customer by its email.
     *
     * @param email the email of the customer to get.
     * @return the customer with the specified email, or null if not found.
     */
    public Customer getCustomerByEmail(String email) {
        return this.customerRepo.findByEmail(email).orElse(null);
    }

    /**
     * Gets all the coupons in the Coupon System.
     *
     * @return a list of all coupons in the Coupon System, sorted by their ID.
     */
    public List<Coupon> getAllCoupons() {
        List<Coupon> coupons = couponRepo.findAll();
        coupons.sort(Comparator.comparing(Coupon::getId));
        return coupons;
    }

    // ADD

    /**
     * Adds a new company to the system.
     *
     * @param company the company to add.
     * @return the added company.
     * @throws CouponSystemException if the company already exists in the system.
     */
    public Company addCompany(Company company) throws CouponSystemException {
        if (this.companyRepo.existsByEmail(company.getEmail())) {
            throw new CouponSystemException(ExceptionMessage.EMAIL_ALREADY_EXIST.getMessage());
        }
        if (this.companyRepo.existsByName(company.getName())) {
            throw new CouponSystemException(ExceptionMessage.EXIST_BY_NAME.getMessage());
        } else {
            return companyRepo.save(company);
        }
    }

    /**
     * Adds a new customer to the Coupon System.
     *
     * @param customer the customer to add to the Coupon System.
     * @return the added customer.
     * @throws CouponSystemException if the email of the customer already exists in the system.
     */
    public Customer addCustomer(Customer customer) throws CouponSystemException {
        if (customerRepo.existsByEmail(customer.getEmail())) {
            throw new CouponSystemException("Error: " + ExceptionMessage.EMAIL_ALREADY_EXIST.getMessage());
        }
        return customerRepo.save(customer);


    }

    // UPDATE

    /**
     * Updates an existing company in the system.
     *
     * @param company the company to update.
     * @return the updated company.
     * @throws CouponSystemException if the company does not exist in the system.
     */
    public Company updateCompany(Company company) throws CouponSystemException {
        companyRepo.findById(company.getId())
                .orElseThrow(() -> new CouponSystemException((ExceptionMessage.COMPANY_NOT_EXIST.getMessage())));
        return companyRepo.save(company);
    }

    /**
     * Updates an existing customer in the Coupon System.
     *
     * @param customer the customer to update.
     * @return the updated customer.
     * @throws CouponSystemException if the email of the customer to update does not exist in the system or if the ID of the customer to update does not match the ID of the existing customer in the system.
     */
    public Customer updateCustomer(Customer customer) throws CouponSystemException {
        Customer updateCustomer = customerRepo.findByEmail(customer.getEmail())
                .orElseThrow(() -> new CouponSystemException("Error: " + ExceptionMessage.CUSTOMER_NOT_EXIST.getMessage()));
        if (customer.getId() != updateCustomer.getId()) {
            throw new CouponSystemException("Error: " + ExceptionMessage.VALUE_CANNOT_BE_CHANGED.getMessage());
        } else {
            return customerRepo.save(customer);
        }
    }

    // DELETE

    /**
     * Deletes a company from the system.
     *
     * @param companyId the ID of the company to delete.
     * @throws CouponSystemException if the company does not exist in the system.
     */
    public void deleteCompany(int companyId) throws CouponSystemException {

        Company company = this.companyRepo.findById(companyId)
                .orElseThrow(() -> new CouponSystemException((ExceptionMessage.COMPANY_NOT_EXIST.getMessage())));

        couponRepo.deleteCouponsByCompanyId(companyId);
        couponRepo.deleteByCompany(companyId);
        companyRepo.delete(company);
    }

    /**
     * Deletes a customer from the Coupon System.
     *
     * @param customerId the ID of the customer to delete.
     * @throws CouponSystemException if the customer to delete does not exist in the system.
     */
    public void deleteCustomer(int customerId) throws CouponSystemException {
        if (!this.customerRepo.existsById(customerId)) {
            throw new CouponSystemException("Error: " + ExceptionMessage.CUSTOMER_NOT_EXIST.getMessage());
        } else {
            this.couponRepo.deleteCustomerCoupons(customerId);
            this.customerRepo.deleteById(customerId);
        }
    }


}


