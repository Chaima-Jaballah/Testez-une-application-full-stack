package com.openclassrooms.starterjwt.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.payload.request.LoginRequest;
import com.openclassrooms.starterjwt.payload.request.SignupRequest;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import javax.transaction.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class AuthControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setup() {
        userRepository.deleteAll(); // Nettoyer la BDD entre les tests
    }

    @Test
    void testRegisterUser_Success() throws Exception {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("newuser@example.com");
        signupRequest.setFirstName("New");
        signupRequest.setLastName("User");
        signupRequest.setPassword("test1234");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signupRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("User registered successfully!"));
    }

    @Test
    void testRegisterUser_EmailAlreadyExists() throws Exception {
        // Préparer un utilisateur existant
        User user = new User();
        user.setEmail("existing@example.com");
        user.setPassword(passwordEncoder.encode("password"));
        user.setFirstName("Existing");
        user.setLastName("User");
        userRepository.save(user);

        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("existing@example.com");
        signupRequest.setFirstName("New");
        signupRequest.setLastName("User");
        signupRequest.setPassword("test1234");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signupRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Error: Email is already taken!"));
    }

    @Test
    void testLogin_Success() throws Exception {
        // Enregistrer un utilisateur valide
        User user = new User();
        user.setEmail("login@example.com");
        user.setPassword(passwordEncoder.encode("password123"));
        user.setFirstName("Login");
        user.setLastName("User");
        user.setAdmin(true);
        userRepository.save(user);

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("login@example.com");
        loginRequest.setPassword("password123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.username").value("login@example.com"))
                .andExpect(jsonPath("$.admin").value(true));
    }

    @Test
    void testLogin_InvalidPassword() throws Exception {
        User user = new User();
        user.setEmail("wrongpass@example.com");
        user.setPassword(passwordEncoder.encode("correctpass"));
        user.setFirstName("Wrong");
        user.setLastName("Password");
        userRepository.save(user);

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("wrongpass@example.com");
        loginRequest.setPassword("wrongpass");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized());
    }
}
