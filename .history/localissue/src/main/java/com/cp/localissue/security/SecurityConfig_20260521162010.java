package com.cp.localissue.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http
            .csrf(csrf -> csrf.disable())

            .authorizeHttpRequests(auth -> auth

                // PUBLIC ROUTES
                .requestMatchers(
                    "/issues/**",
                    "/api/images/**",
                    "/uploads/**",
                    "/api/auth/**"
                    ).permitAll()
                // ADMIN ROUTES
                .requestMatchers("/api/admin/**")
                .authenticated()

                // EVERYTHING ELSE
                .anyRequest()
                .authenticated()
            )

            .formLogin(form -> form.permitAll());

        return http.build();
    }
}