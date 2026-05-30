package com.cp.localissue.security;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {
    



    @Autowired
    private JwtFilter jwtFilter;

    // PASSWORD ENCODER
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // SECURITY CONFIG
    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http

            // DISABLE CSRF
            .csrf(csrf -> csrf.disable())

            // AUTHORIZATION RULES
            .authorizeHttpRequests(auth -> auth

                // AUTH APIs
                .requestMatchers("/api/auth/**")
                .permitAll()

                // PUBLIC ISSUE VIEWING
                .requestMatchers(HttpMethod.GET, "/issues/**")
                .permitAll()

                // LOGGED-IN USERS CAN CREATE ISSUES
                .requestMatchers(HttpMethod.POST, "/issues/**")
                .authenticated()

                // LOGGED-IN USERS CAN UPDATE STATUS
                .requestMatchers(HttpMethod.PATCH, "/issues/**")
                .authenticated()

                // EVERYTHING ELSE
                .anyRequest()
                .permitAll()
            )

            // JWT FILTER
            .addFilterBefore(
                jwtFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }
}