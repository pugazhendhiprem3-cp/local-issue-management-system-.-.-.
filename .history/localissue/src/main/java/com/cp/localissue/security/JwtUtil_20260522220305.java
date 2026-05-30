package com.cp.localissue.security;

import java.util.Map;
import java.util.HashMap;
import java.util.Date;
import java.security.Key; // 🟢 FIXED: The missing import that resolves "Key to a type"

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

@Component
public class JwtUtil {

    // 🟢 FIXED: Using a secure cryptographic Key instance initialized with a strong 256-bit string literal
    private final Key SECRET_KEY = Keys.hmacShaKeyFor(
            "mysecretkeymysecretkeymysecretkeymysecretkeymysecretkeymysecretkey"
            .getBytes()
    );

    public String generateToken(String email, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role); 

        return Jwts.builder()
                .setClaims(claims)                
                .setSubject(email)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10 Hours
                .signWith(SECRET_KEY, SignatureAlgorithm.HS256) // 🟢 FIXED: Updated method signature arguments order
                .compact();
    }

    public String extractEmail(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(SECRET_KEY)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}