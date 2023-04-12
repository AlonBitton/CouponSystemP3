package com.Alon.CouponSystemP2.auth;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import java.lang.annotation.*;

/**
 The CurrentUser annotation is used to inject the currently authenticated user principal into a controller method.
 The annotation is used in conjunction with Spring Security's @AuthenticationPrincipal annotation,
 which allows to obtain the currently authenticated user's UserDetails object.
 This annotation can be used to simplify the process of obtaining the currently authenticated user's
 UserDetails object in Spring Security-enabled applications.
 */
@Target({ElementType.PARAMETER, ElementType.ANNOTATION_TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@AuthenticationPrincipal
public @interface CurrentUser {
}