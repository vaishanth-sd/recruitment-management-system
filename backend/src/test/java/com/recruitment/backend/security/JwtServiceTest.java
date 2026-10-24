package com.recruitment.backend.security;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    @Test
    void testTokenGenerationAndValidationWithGeneratedKey() {
        JwtService jwtService = new JwtService("", 3600000L);

        String email = "candidate@example.com";
        String role = "CANDIDATE";

        String token = jwtService.generateToken(email, role);

        assertNotNull(token);
        assertTrue(jwtService.isTokenValid(token));
        assertEquals(email, jwtService.extractEmail(token));
        assertEquals(role, jwtService.extractRole(token));
    }

    @Test
    void testTokenValidationFailsOnTamperedToken() {
        JwtService jwtService = new JwtService("", 3600000L);

        String token = jwtService.generateToken("recruiter@example.com", "RECRUITER");
        String tamperedToken = token + "xyz";

        assertFalse(jwtService.isTokenValid(tamperedToken));
        assertFalse(jwtService.isTokenValid("invalid.token.structure"));
    }

    @Test
    void testTokenWithCustomBase64Secret() {
        // 256-bit Base64 secret
        String base64Secret = "dGhpc2lzYXZlcnlzZWN1cmVhbmRsb25namt0c2VjcmV0a2V5MTIzNDU2Nzg5MDEyMzQ1Njc4OTA=";
        JwtService jwtService = new JwtService(base64Secret, 3600000L);

        String email = "admin@example.com";
        String role = "RECRUITER";

        String token = jwtService.generateToken(email, role);

        assertTrue(jwtService.isTokenValid(token));
        assertEquals(email, jwtService.extractEmail(token));
        assertEquals(role, jwtService.extractRole(token));
    }
}
