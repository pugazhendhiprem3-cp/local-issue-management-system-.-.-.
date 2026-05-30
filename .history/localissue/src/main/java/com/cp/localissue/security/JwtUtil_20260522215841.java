package com.cp.localissue.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import java.util.List;
import java.util.Date;
import java.util.HashMap;
import java.uti
import io.jsonwebtoken.security.Keys;
import java.security.Key;

@Component
public class JwtUtil {

    private final Key SECRET_KEY =
        Keys.hmacShaKeyFor(
                "mysecretkeymysecretkeymysecretkey"
                        .getBytes()
        );

    // 🟢 Update this method inside your JwtUtil.java file
public String generateToken(String email, String role) {
    Map<String, Object> claims = new HashMap<>();
    claims.put("role", role); // Store the user role inside the token claims payload
    
    return Jwts.builder()
            .setClaims(claims)
            .setSubject(email)
            .setIssuedAt(new Date(System.currentTimeMillis()))
            .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10 Hours
            .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
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

    } 
    catch (Exception e) {

            return false;
        }
    }
}