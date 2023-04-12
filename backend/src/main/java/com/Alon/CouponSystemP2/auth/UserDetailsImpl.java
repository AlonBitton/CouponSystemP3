package com.Alon.CouponSystemP2.auth;

import com.Alon.CouponSystemP2.entites.ClientType;
import com.Alon.CouponSystemP2.entites.Company;
import com.Alon.CouponSystemP2.entites.Customer;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.Serial;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;


/**
 * Implements the UserDetails interface of Spring Security.
 * This class is responsible for holding the details of a user.
 */
public class UserDetailsImpl implements UserDetails {

    @Serial
    private static final long serialVersionUID = 1L;
    private final int id;
    private final String email;
    @JsonIgnore
    private final String password;
    private final ClientType clientType;

    /**
     * Constructor to create a UserDetailsImpl object.
     *
     * @param id         The user's id.
     * @param email      The user's email address.
     * @param password   The user's password.
     * @param clientType The user's client type (e.g., customer, company, administrator).
     */
    public UserDetailsImpl(int id, String email, String password, ClientType clientType) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.clientType = clientType;
    }

    /**
     * Builds a UserDetailsImpl object based on the given customer and client type.
     *
     * @param customer   The customer whose details to include in the UserDetailsImpl object.
     * @param clientType The client type (e.g., customer, company, administrator).
     * @return A UserDetailsImpl object.
     */
    public static UserDetailsImpl buildCustomer(Customer customer, ClientType clientType) {
        return new UserDetailsImpl(
                customer.getId(),
                customer.getEmail(),
                customer.getPassword(),
                clientType
        );
    }

    /**
     * Builds a UserDetailsImpl object based on the given company and client type.
     *
     * @param company    The company whose details to include in the UserDetailsImpl object.
     * @param clientType The client type (e.g., customer, company, administrator).
     * @return A UserDetailsImpl object.
     */
    public static UserDetailsImpl buildCompany(Company company, ClientType clientType) {
        return new UserDetailsImpl(
                company.getId(),
                company.getEmail(),
                company.getPassword(),
                clientType
        );
    }

    @Override
    public String toString() {
        return "UserDetailsImpl{" +
                "id=" + id +
                ", email='" + email + '\'' +
                ", clientType=" + clientType +
                '}';
    }

    @Override
    public String getPassword() {
        return password;
    }

    public String getEmail() {
        return email;
    }

    public int getId() {
        return id;
    }

    public ClientType getClientType() {
        return clientType;
    }


    /**
     * Client Type is being implemented as the Granted Authorities
     *
     * @return List<SimpleGrantedAuthority>
     */
    @Override
    public Collection<SimpleGrantedAuthority> getAuthorities() {
        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(clientType.name()));
        return authorities;
    }


    @Override
    public String getUsername() {
        return null;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
