package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.payload.request.LoginRequest;
import com.openclassrooms.starterjwt.payload.request.SignupRequest;
import com.openclassrooms.starterjwt.payload.response.JwtResponse;
import com.openclassrooms.starterjwt.payload.response.MessageResponse;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.security.jwt.JwtUtils;
import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@SpringBootTest
@ActiveProfiles("test")
class AuthControllerTest {

        @Mock
        private AuthenticationManager authenticationManager;
        @Mock
        private JwtUtils jwtUtils;
        @Mock
        private PasswordEncoder passwordEncoder;
        @Mock
        private UserRepository userRepository;

        @Test
        public void testAuthenticateUserOk() {
                Long id = 1L;
                String email = "test@test.com";
                String password = "password";
                String firstname = "john";
                String lastname = "doe";
                boolean isAdmin = false;

                UserDetailsImpl userDetails = UserDetailsImpl
                                .builder()
                                .username(email)
                                .firstName(firstname)
                                .lastName(lastname)
                                .id(id)
                                .password(password)
                                .build();

                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                                userDetails, null);

                when(authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password)))
                                .thenReturn(authentication);
                when(jwtUtils.generateJwtToken(authentication)).thenReturn("jwt");
                when(userRepository.findByEmail(email)).thenReturn(
                                Optional.of(User
                                                .builder()
                                                .id(id)
                                                .email(email)
                                                .password(password)
                                                .firstName(firstname)
                                                .lastName(lastname)
                                                .admin(isAdmin)
                                                .build()));

                AuthController authController = new AuthController(authenticationManager, passwordEncoder, jwtUtils,
                                userRepository);
                ResponseEntity<?> response = authController.authenticateUser(new LoginRequest(email, password));
                JwtResponse responseBody = (JwtResponse) response.getBody();

                assertEquals(HttpStatus.OK, response.getStatusCode());
                assertEquals(email,
                                responseBody != null && responseBody.getUsername() != null ? responseBody.getUsername()
                                                : null);
                assertEquals(firstname,
                                responseBody != null && responseBody.getFirstName() != null
                                                ? responseBody.getFirstName()
                                                : null);
                assertEquals(lastname,
                                responseBody != null && responseBody.getLastName() != null ? responseBody.getLastName()
                                                : null);
                assertEquals(id, responseBody != null && responseBody.getId() != null ? responseBody.getId() : null);
                assertEquals(isAdmin, responseBody != null && responseBody.getAdmin() != null ? responseBody.getAdmin()
                                : null);
                assertEquals("Bearer",
                                responseBody != null && responseBody.getType() != null ? responseBody.getType() : null);
                assertNotNull(responseBody != null && responseBody.getToken() != null ? responseBody.getToken() : null);
        }

        @Test
        public void testRegisterUserOk() {
                String email = "test@test.com";
                String password = "password";

                when(userRepository.existsByEmail(email)).thenReturn(false);
                when(passwordEncoder.encode(password)).thenReturn("hashed");
                when(userRepository.save(any(User.class))).thenReturn(new User());

                AuthController authController = new AuthController(authenticationManager, passwordEncoder, jwtUtils,
                                userRepository);
                ResponseEntity<?> response = authController.registerUser(new SignupRequest(email, "", "", password));
                assertEquals(HttpStatus.OK, response.getStatusCode());
        }

        @Test
        public void testRegisterUserEmailAlreadyTaken() {
                String email = "test@test.com";
                String password = "password";
                when(userRepository.existsByEmail(email)).thenReturn(true);
                AuthController authController = new AuthController(authenticationManager, passwordEncoder, jwtUtils,
                                userRepository);
                ResponseEntity<?> response = authController.registerUser(new SignupRequest(email, "", "", password));

                MessageResponse messageResponse = (MessageResponse) response.getBody();
                assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
                assertEquals("Error: Email is already taken!",
                                messageResponse != null && messageResponse.getMessage() != null
                                                ? messageResponse.getMessage()
                                                : null);

        }
}