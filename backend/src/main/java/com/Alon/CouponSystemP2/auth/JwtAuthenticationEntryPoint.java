package com.Alon.CouponSystemP2.auth;

import com.Alon.CouponSystemP2.exception.ExceptionMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**

 The JwtAuthenticationEntryPoint class implements AuthenticationEntryPoint and is responsible for handling unauthorized access to a protected resource.
 */
@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private static final Logger LOGGER = LoggerFactory.getLogger(JwtAuthenticationEntryPoint.class);

    /**
     This method handles an authentication exception by sending an HTTP unauthorized response.
     @param httpServletRequest The HttpServletRequest object.
     @param httpServletResponse The HttpServletResponse object.
     @param e The AuthenticationException object.
     @throws IOException when an I/O exception occurs.
     @throws ServletException when a servlet exception occurs.
     */
    @Override
    public void commence(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, AuthenticationException e)
            throws IOException, ServletException {
        LOGGER.error("Responding with unauthorized error. Message - {}", e.getMessage());
        httpServletResponse.sendError(HttpStatus.UNPROCESSABLE_ENTITY.value(), ExceptionMessage.AUTHENTICATION_FAILED.getMessage());
    }
}
