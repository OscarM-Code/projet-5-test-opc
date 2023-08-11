package com.openclassrooms.starterjwt.security.jwt;

import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.test.context.ActiveProfiles;

import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class JwtUtilsTest {

    @Autowired
    private JwtUtils jwtUtils;

    @Test
    public void testGenerateAndValidateJwt() {
        UserDetailsImpl userDetails = UserDetailsImpl.builder()
                .username("test@test.com").build();
        String jwt = jwtUtils.generateJwtToken(new UsernamePasswordAuthenticationToken(userDetails, null));
        assertTrue(jwtUtils.validateJwtToken(jwt));
        assertEquals("test@test.com", jwtUtils.getUserNameFromJwtToken(jwt));
    }

    @Test
    public void testMalformedJwt() {
        assertFalse(jwtUtils.validateJwtToken("defrvgtbhyujkjyhtgfrgthty"));
    }

    @Test
    public void testExpiredJwt() {
        String jwt = Jwts.builder()
                .setSubject("test@test.com")
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() - 1))
                .signWith(SignatureAlgorithm.HS512, "testSecret")
                .compact();

        assertFalse(jwtUtils.validateJwtToken(jwt));
    }

    @Test
    public void testInvalidSignatureJwt() {
        String jwt = Jwts.builder()
                .setSubject("test@test.com")
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + 1000))
                .signWith(SignatureAlgorithm.HS512, "TestSecret")
                .compact();

        assertFalse(jwtUtils.validateJwtToken(jwt));
    }
}