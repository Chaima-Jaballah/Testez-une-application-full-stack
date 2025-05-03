package com.openclassrooms.starterjwt.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.ArrayList;
import java.util.Calendar;

import javax.transaction.Transactional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.AbstractIntegrationTest;
import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;

@SpringBootTest()
@AutoConfigureMockMvc
@Transactional
class SessionControllerIT extends AbstractIntegrationTest {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private SessionRepository sessionRepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private ObjectMapper objectMapper;

	private Session session;
	private String token;

	@BeforeEach
	void setUp() throws Exception {
		token = obtainAccessToken();
		sessionRepository.deleteAll();

		session = new Session();
		session.setName("Yoga doux");

		Calendar calendar = Calendar.getInstance();
		calendar.set(2025, Calendar.AUGUST, 2);
		session.setDate(calendar.getTime());

		session.setDescription("Séance détente");
		session.setUsers(new ArrayList<>());

		session = sessionRepository.save(session);
	}

	@Test
	void testFindById_found() throws Exception {
		mockMvc.perform(get("/api/session/{id}", session.getId()).header("Authorization", "Bearer " + token))
				.andExpect(status().isOk()).andExpect(jsonPath("$.name").value("Yoga doux"));
	}

	@Test
	void testFindById_notFound() throws Exception {
		mockMvc.perform(get("/api/session/{id}", 9999).header("Authorization", "Bearer " + token))
				.andExpect(status().isNotFound());
	}

	@Test
	void testFindAll() throws Exception {
		mockMvc.perform(get("/api/session").header("Authorization", "Bearer " + token)).andExpect(status().isOk())
				.andExpect(jsonPath("$[0].name").value("Yoga doux"));
	}

	@Test
	void testCreate() throws Exception {
		SessionDto dto = new SessionDto();
		dto.setName("Nouveau cours");

		Calendar calendar = Calendar.getInstance();
		calendar.add(Calendar.DATE, 1);
		dto.setDate(calendar.getTime());

		dto.setDescription("Cours dynamique");
		dto.setTeacher_id(1L); // Assurez-vous qu'un teacher avec cet ID existe ou adaptez

		mockMvc.perform(post("/api/session").header("Authorization", "Bearer " + token)
				.contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(dto)))
				.andExpect(status().isOk()).andExpect(jsonPath("$.name").value("Nouveau cours"));
	}

	@Test
	void testUpdate() throws Exception {
		SessionDto dto = new SessionDto();
		dto.setName("Modifié");

		Calendar calendar = Calendar.getInstance();
		calendar.add(Calendar.DATE, 2);
		dto.setDate(calendar.getTime());

		dto.setDescription("Description modifiée");
		dto.setTeacher_id(1L);

		mockMvc.perform(put("/api/session/{id}", session.getId()).header("Authorization", "Bearer " + token)
				.contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(dto)))
				.andExpect(status().isOk()).andExpect(jsonPath("$.name").value("Modifié"));
	}

	@Test
	void testDelete() throws Exception {
		mockMvc.perform(delete("/api/session/{id}", session.getId()).header("Authorization", "Bearer " + token))
				.andExpect(status().isOk());
	}

	@Test
	void testParticipate() throws Exception {
		User user = new User();
		user.setEmail("test@example.com");
		user.setFirstName("Test");
		user.setLastName("User");
		user.setPassword("hashed");
		user = userRepository.save(user);

		mockMvc.perform(post("/api/session/{id}/participate/{userId}", session.getId(), user.getId())
				.header("Authorization", "Bearer " + token)).andExpect(status().isOk());
	}

	@Test
	void testNoLongerParticipate() throws Exception {
		User user = new User();
		user.setEmail("test2@example.com");
		user.setFirstName("Test2");
		user.setLastName("User2");
		user.setPassword("hashed");
		user = userRepository.save(user);

		session.getUsers().add(user);
		sessionRepository.save(session);

		mockMvc.perform(delete("/api/session/{id}/participate/{userId}", session.getId(), user.getId())
				.header("Authorization", "Bearer " + token)).andExpect(status().isOk());
	}

}