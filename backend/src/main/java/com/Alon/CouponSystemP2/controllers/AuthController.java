package com.Alon.CouponSystemP2.controllers;

import com.Alon.CouponSystemP2.auth.JwtTokenProvider;
import com.Alon.CouponSystemP2.entites.ClientType;
import com.Alon.CouponSystemP2.entites.Credentials;
import com.Alon.CouponSystemP2.exception.CouponSystemException;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;


@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/api/auth")
public class AuthController {

    private final Log logger = LogFactory.getLog(AuthController.class);
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    /**
     Authenticates a user with the provided credentials and client type, generates a JWT token and returns it
     as a response entity.
     The credentials include the email and password of the user, and the client type is the
     type of the user (ADMIN, COMPANY or CUSTOMER).
     If the authentication is successful, the user's authentication is being stored in the SecurityContextHolder.
     @param credentials the user's credentials (email and password).
     @param clientType the client type of the user.
     @return a response entity containing the JWT token if the authentication is successful or an error message if the authentication fails.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Credentials credentials, @RequestParam String clientType){

        ClientType type = ClientType.valueOf(clientType);

        String loginAuth = credentials.getEmail() + ":" + type;

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginAuth, credentials.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            logger.info("Email obtained from SecurityContextHolder: " + credentials.getEmail());
            logger.info("Is " + credentials.getEmail() + " Authenticated? : " + SecurityContextHolder.getContext().getAuthentication().isAuthenticated());

            String jwt = jwtTokenProvider.generateToken(credentials, type);
            return new ResponseEntity<>(jwt, HttpStatus.OK);

        } catch (UsernameNotFoundException e) {
            return new ResponseEntity<>("Error: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }


    }

}
