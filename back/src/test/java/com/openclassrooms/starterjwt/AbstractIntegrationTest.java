package com.openclassrooms.starterjwt;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;

public abstract class AbstractIntegrationTest {

    @Autowired
    protected MockMvc mockMvc;

    @Autowired
    protected ObjectMapper objectMapper;

    protected String obtainAccessToken() throws Exception {
        Map<String, String> loginPayload = new HashMap<>();
        loginPayload.put("email", "yoga@studio.com");
        loginPayload.put("password", "test!1234");

        String response = mockMvc
                .perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginPayload)))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        return objectMapper.readTree(response).get("token").asText();
    }
}