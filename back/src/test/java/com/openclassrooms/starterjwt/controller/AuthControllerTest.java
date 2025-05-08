package com.openclassrooms.starterjwt.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.openclassrooms.starterjwt.controllers.AuthController;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.payload.request.LoginRequest;
import com.openclassrooms.starterjwt.payload.request.SignupRequest;
import com.openclassrooms.starterjwt.payload.response.JwtResponse;
import com.openclassrooms.starterjwt.payload.response.MessageResponse;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.security.jwt.JwtUtils;
import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import org.junit.jupiter.api.BeforeEach;
import org.mockito.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
class AuthControllerTest {
	@Mock
	private AuthenticationManager authenticationManager;

	@Mock
	private PasswordEncoder passwordEncoder;

	@Mock
	private JwtUtils jwtUtils;

	@Mock
	private UserRepository userRepository;

	@InjectMocks
	private AuthController authController;

	private LoginRequest loginRequest;
	private SignupRequest signupRequest;

	@BeforeEach
	void setup() {
		loginRequest = new LoginRequest();
		loginRequest.setEmail("yoga@studio.com");
		loginRequest.setPassword("test!1234");

		signupRequest = new SignupRequest();
		signupRequest.setEmail("yoga@studio.com");
		signupRequest.setPassword("test!1234");
		signupRequest.setFirstName("Chaima");
		signupRequest.setLastName("YOGA");
	}

	@Test
	void authenticateUser_validCredentials_returnsJwtResponse() {
		Authentication authMock = mock(Authentication.class);
		UserDetailsImpl userDetails = UserDetailsImpl.builder().id(1L).username("yoga@studio.com").firstName("Chaima")
				.lastName("YOGA").password("encoded").build();

		when(authenticationManager.authenticate(any())).thenReturn(authMock);
		when(authMock.getPrincipal()).thenReturn(userDetails);
		when(jwtUtils.generateJwtToken(authMock)).thenReturn("mocked-jwt");

		User user = new User();
		user.setEmail("yoga@studio.com");
		user.setAdmin(true);

		when(userRepository.findByEmail("yoga@studio.com")).thenReturn(Optional.of(user));

		ResponseEntity<?> response = authController.authenticateUser(loginRequest);

		assertEquals(200, response.getStatusCodeValue());
		assertTrue(response.getBody() instanceof JwtResponse);
		JwtResponse jwt = (JwtResponse) response.getBody();
		assertEquals("mocked-jwt", jwt.getToken());
		assertTrue(jwt.getAdmin());
	}

	@Test
	void registerUser_emailAlreadyExists_returnsBadRequest() {
		when(userRepository.existsByEmail("yoga@studio.com")).thenReturn(true);

		ResponseEntity<?> response = authController.registerUser(signupRequest);

		assertEquals(400, response.getStatusCodeValue());
		assertTrue(response.getBody() instanceof MessageResponse);
		assertEquals("Error: Email is already taken!", ((MessageResponse) response.getBody()).getMessage());
	}

	@Test
	void registerUser_successful_returnsOk() {
		when(userRepository.existsByEmail("yoga@studio.com")).thenReturn(false);
		when(passwordEncoder.encode("test!1234")).thenReturn("encodedPassword");

		ResponseEntity<?> response = authController.registerUser(signupRequest);

		assertEquals(200, response.getStatusCodeValue());
		assertTrue(response.getBody() instanceof MessageResponse);
		assertEquals("User registered successfully!", ((MessageResponse) response.getBody()).getMessage());

		verify(userRepository).save(any(User.class));
	}
}