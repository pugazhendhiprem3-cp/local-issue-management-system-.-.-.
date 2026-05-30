package com.cp.localissue.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import com.cp.localissue.security.JwtFilter;

@Configuration
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

   @Bean
public SecurityFilterChain securityFilterChain(
        HttpSecurity http) throws Exception {

    http
        .csrf(csrf -> csrf.disable())

        .authorizeHttpRequests(auth -> auth
            .requestMatchers(
                "/api/images/**",
                "/uploads/**",
                "/api/auth/**"
            ).permitAll()
            .requestMatchers("/api/admin/**")
            .hasAuthority("ADMIN")
            .requestMatchers(HttpMethod.GET, "/issues/**")
        .permitAll()

        .requestMatchers(HttpMethod.POST, "/issues/**")
        .authenticated()

    .requestMatchers(HttpMethod.PATCH, "/issues/**")
.authenticated()

.anyRequest()
.permitAll()

            .anyRequest()
            .permitAll()
        );
        http.addFilterBefore(
        jwtFilter,
        UsernamePasswordAuthenticationFilter.class
        );

    return http.build();
}
}