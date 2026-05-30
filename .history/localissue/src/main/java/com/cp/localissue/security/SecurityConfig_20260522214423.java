package com.cp.localissue.security;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.cp.localissue.dto.LoginRequestDTO;
import com.cp.localissue.dto.LoginResponseDTO;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Autowired
    private JwtFilter jwtFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> {})
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                // PUBLIC IMAGE SERVING
                .requestMatchers("/uploads/**", "/serve/**").permitAll()

                // AUTH APIs
                .requestMatchers("/api/auth/**").permitAll()

                // PUBLIC ISSUE VIEWING (Fixed matching rules)
                .requestMatchers(HttpMethod.GET, "/issues", "/issues/**").permitAll()

                // SECURE REQUIREMENT FOR SUBMISSIONS (Requires JWT authorization pass)
                .requestMatchers(HttpMethod.POST, "/issues", "/issues/**").authenticated()

                // LOGGED-IN USERS CAN UPDATE STATUS
                .requestMatchers(HttpMethod.PATCH, "/issues/**").authenticated()

                // EVERYTHING ELSE
                .anyRequest().permitAll()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    public LoginResponseDTO login(LoginRequestDTO dto) {
    User user = userRepository.findByEmail(dto.getEmail())
            .orElseThrow(() -> new RuntimeException("Invalid Email"));

    // Add these debug lines here:
    System.out.println("--- LOGIN DEBUG ---");
    System.out.println("Raw Input Password: " + dto.getPassword());
    System.out.println("Database Hash Found: " + user.getPassword());
    System.out.println("Length of Hash: " + user.getPassword().length());

    boolean passwordMatches = passwordEncoder.matches(
            dto.getPassword(),
            user.getPassword()
    );
    // ... rest of code
}

}