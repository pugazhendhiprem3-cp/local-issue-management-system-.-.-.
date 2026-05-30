package com.cp.localissue.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

import java.util.Date;
import io.jsonwebtoken.security.Keys;
import java.security.Key;

@Component
public class JwtUtil {

    private final Key SECRET_KEY =
        Keys.hmacShaKeyFor(
                "mysecretkeymysecretkeymysecretkey"
                        .getBytes()
        );

    public String generateToken(String email) {

        return Jwts.builder()

                .setSubject(email)

                .setIssuedAt(new Date())

                .setExpiration(
                        new Date(System.currentTimeMillis()
                                + 1000 * 60 * 60)
                )

                .signWith(SECRET_KEY)

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
}