package com.openclassrooms.starterjwt.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import javax.transaction.Transactional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.openclassrooms.starterjwt.AbstractIntegrationTest;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;

@SpringBootTest()
@AutoConfigureMockMvc
@Transactional
class UserControllerIT extends AbstractIntegrationTest {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	private User user;

	@BeforeEach
	void setUp() {
		userRepository.deleteAll();

		user = new User();
		user.setEmail("yoga@studio.com");
		user.setFirstName("Yoga");
		user.setLastName("User");
		user.setPassword(passwordEncoder.encode("test!1234"));
		user.setAdmin(false);

		user = userRepository.save(user);
	}

	@Test
	void testFindById_Success() throws Exception {
		String token = obtainAccessToken();

		mockMvc.perform(get("/api/user/{id}", user.getId()).header("Authorization", "Bearer " + token)
				.contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk())
				.andExpect(jsonPath("$.email").value("yoga@studio.com"));
	}

	@Test
	void testFindById_NotFound() throws Exception {
		String token = obtainAccessToken();

		mockMvc.perform(get("/api/user/{id}", 9999L).header("Authorization", "Bearer " + token))
				.andExpect(status().isNotFound());
	}

	@Test
	void testFindById_BadRequest() throws Exception {
		String token = obtainAccessToken();

		mockMvc.perform(get("/api/user/invalid").header("Authorization", "Bearer " + token))
				.andExpect(status().isBadRequest());
	}

	@Test
	void testDelete_Success() throws Exception {
		String token = obtainAccessToken();

		mockMvc.perform(delete("/api/user/{id}", user.getId()).header("Authorization", "Bearer " + token))
				.andExpect(status().isOk());
	}

	@Test
	void testDelete_UnauthorizedUser() throws Exception {
		// Créer un autre utilisateur
		User other = new User();
		other.setEmail("other@example.com");
		other.setPassword(passwordEncoder.encode("secret"));
		other.setFirstName("Other");
		other.setLastName("User");
		other = userRepository.save(other);

		// Authentifier avec yoga@studio.com
		String token = obtainAccessToken();

		// Essayer de supprimer l'autre utilisateur
		mockMvc.perform(delete("/api/user/{id}", other.getId()).header("Authorization", "Bearer " + token))
				.andExpect(status().isUnauthorized());
	}

	@Test
	void testDelete_NotFound() throws Exception {
		String token = obtainAccessToken();

		mockMvc.perform(delete("/api/user/{id}", 9999).header("Authorization", "Bearer " + token))
				.andExpect(status().isNotFound());
	}
}
