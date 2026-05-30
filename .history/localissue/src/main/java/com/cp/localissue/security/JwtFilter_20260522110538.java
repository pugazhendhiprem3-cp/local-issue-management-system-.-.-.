package com.cp.localissue.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)

            throws ServletException, IOException {

        String authHeader =
                request.getHeader("Authorization");

        if (authHeader != null
                && authHeader.startsWith("Bearer ")) {

            String token =
        authHeader.substring(7);

boolean isValid =
        jwtUtil.validateToken(token);

if (isValid) {

    String email =
            jwtUtil.extractEmail(token);

    System.out.println("VALID USER: " + email);

} else {

    System.out.println("INVALID TOKEN");
}

            System.out.println("TOKEN: " + token);

            // later:
            // validate token
            // extract email
            // authenticate user
        }

        filterChain.doFilter(request, response);
    }
}
