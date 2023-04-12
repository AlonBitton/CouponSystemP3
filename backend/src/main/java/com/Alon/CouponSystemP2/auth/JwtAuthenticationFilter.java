package com.Alon.CouponSystemP2.auth;

import com.Alon.CouponSystemP2.entites.Credentials;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import static com.Alon.CouponSystemP2.auth.UtilConstants.AUTH_HEADER;
import static com.Alon.CouponSystemP2.auth.UtilConstants.BEARER_TOKEN_PREFIX;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger LOGGER = LoggerFactory.getLogger(JwtAuthenticationFilter.class);
    @Autowired
    private  JwtTokenProvider jwtTokenProvider;
    @Autowired
    private UserDetailServiceImpl userDetailService;

    /**
     * Authenticates the incoming request using JWT token.
     *
     * @param request the incoming request
     * @param response the response
     * @param filterChain the filter chain
     * @throws ServletException if there is an error in the servlet
     * @throws IOException if there is an error in the input/output
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException{

        try {

            String jwt = getJwtFromRequest(request);
            LOGGER.info("JWT token from request: {}", jwt);

            if (jwt == null)  {
                LOGGER.trace("No JWT token found in request.");
                filterChain.doFilter(request, response);
                return;
            }

            if (StringUtils.hasText(jwt) && jwtTokenProvider.validateToken(jwt)) {

                Credentials credentials = jwtTokenProvider.getCredentialsFromJWT(jwt);
                UserDetails userDetails = userDetailService.loadUserByUsername(credentials.getEmail());

                UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(userDetails, null,
                        userDetails.getAuthorities());
                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            }

        } catch (UsernameNotFoundException e) {
            LOGGER.error("Could not set user authentication in security context", e);
            new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
        filterChain.doFilter(request, response);
    }

    /**
     * Gets the JWT token from the request header.
     *
     * @param request the incoming request
     * @return the JWT token
     */
    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader(AUTH_HEADER);
        LOGGER.debug("Got bearer token from request header: {}", bearerToken);
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith(BEARER_TOKEN_PREFIX)) {
            return bearerToken.substring(7, bearerToken.length());
        }
        return null;
    }


}
