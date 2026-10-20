
package com.recruitment.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    private final String secret;
    private final long expiration;
    private final SecretKey signingKey;

    public JwtService(
            @Value("${jwt.secret:${JWT_SECRET:}}") String secret,
            @Value("${jwt.expiration:86400000}") long expiration) {
        this.secret = secret;
        this.expiration = expiration;
        this.signingKey = initSigningKey(secret);
    }

    private SecretKey initSigningKey(String secret) {
        if (secret != null && !secret.isBlank()) {
            try {
                byte[] keyBytes = Decoders.BASE64.decode(secret.trim());
                if (keyBytes.length >= 32) {
                    return Keys.hmacShaKeyFor(keyBytes);
                }
            } catch (Exception ignored) {
                // Not valid base64, attempt raw UTF-8 bytes below
            }
            byte[] rawBytes = secret.trim().getBytes(StandardCharsets.UTF_8);
            if (rawBytes.length >= 32) {
                return Keys.hmacShaKeyFor(rawBytes);
            }
        }
        return Jwts.SIG.HS256.key().build();
    }

    private SecretKey getSigningKey() {
        return this.signingKey;
    }

    public String generateToken(String email,String role) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);

        return Jwts.builder()
                .subject(email)
                .claim("role", role)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSigningKey())
                .compact();
    }

    public String extractEmail(String token) {
        return extractAllClaims(token).getSubject();
    }

    public String extractRole(String token) {
    return extractAllClaims(token).get("role", String.class);
}

    public boolean isTokenValid(String token) {
        try {
            extractAllClaims(token);
            return true;
        } catch (io.jsonwebtoken.JwtException |
                 IllegalArgumentException exception) {
            return false;
        }
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
