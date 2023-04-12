package com.Alon.CouponSystemP2.auth;

import com.Alon.CouponSystemP2.entites.ClientType;
import com.Alon.CouponSystemP2.entites.Company;
import com.Alon.CouponSystemP2.entites.Customer;
import com.Alon.CouponSystemP2.exception.CouponSystemException;
import com.Alon.CouponSystemP2.services.CompanyService;
import com.Alon.CouponSystemP2.services.CustomerService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * The UserDetailServiceImpl class implements Spring Security's UserDetailsService interface.
 * It provides a method to load a UserDetails object based on a given email and client type.
 */
@Service
public class UserDetailServiceImpl implements UserDetailsService {

    private static final Logger LOGGER = LoggerFactory.getLogger(UserDetailServiceImpl.class);

    @Autowired
    private CompanyService companyService;
    @Autowired
    private CustomerService customerService;

    /**
     * This method loads a UserDetails object based on the given email and client type.
     *
     * @param loginAuth The email and client type separated by a colon (email:clientType).
     * @return UserDetails The UserDetails object representing the user with the given email and client type.
     * @throws UsernameNotFoundException If no user with the given email and client type is found.
     */
    @Override
    @Transactional
    public UserDetails loadUserByUsername(String loginAuth) throws UsernameNotFoundException {

        String[] parts = loginAuth.split(":");
        String email = parts[0];
        ClientType clientType = ClientType.valueOf(parts[1]);

        try {

            switch (clientType) {
                case Customer -> {
                    LOGGER.debug("Loading customer by email: {}", email);
                    Customer customer = customerService.getCustomerByEmail(email);
                    return UserDetailsImpl.buildCustomer(customer, clientType);

                }
                case Company -> {
                    LOGGER.debug("Loading company by email: {}", email);
                    Company company = companyService.getCompanyByEmail(email);
                    return UserDetailsImpl.buildCompany(company, clientType);

                }
                case Administrator -> {
                    LOGGER.debug("Loading administrator user");
                    Customer customer = Customer.builder().email("admin@admin.com").password("admin").build();
                    return UserDetailsImpl.buildCustomer(customer, clientType);
                }
            }

        } catch (CouponSystemException e) {
            LOGGER.error("Error loading user by email and client type: {}", e.getMessage());
            throw new UsernameNotFoundException("Error loading user by email and client type: " + e.getMessage());
        }
        LOGGER.error("No user found with email: {} and client type: {}", email, clientType);
        throw new UsernameNotFoundException("No user found with email: " + email + " and client type: " + clientType);
    }

}
