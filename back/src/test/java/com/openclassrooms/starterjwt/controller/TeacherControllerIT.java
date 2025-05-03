package com.openclassrooms.starterjwt.controller;

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
import org.springframework.test.web.servlet.MockMvc;

import com.openclassrooms.starterjwt.AbstractIntegrationTest;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.TeacherRepository;

@SpringBootTest()
@AutoConfigureMockMvc
@Transactional
class TeacherControllerIT extends AbstractIntegrationTest {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private TeacherRepository teacherRepository;

	@Autowired
	private SessionRepository sessionRepository;

	private Teacher teacher;

	private String token;

	@BeforeEach
	void setUp() throws Exception {
		token = obtainAccessToken();
		sessionRepository.deleteAll();
		teacherRepository.deleteAll();

		teacher = new Teacher();
		teacher.setFirstName("Hélène");
		teacher.setLastName("Thiercelin");

		teacher = teacherRepository.save(teacher);
	}

	@Test
	void testFindAll() throws Exception {
		mockMvc.perform(
				get("/api/teacher").header("Authorization", "Bearer " + token).contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk()).andExpect(jsonPath("$[0].firstName").value("Hélène"));
	}

	@Test
	void testFindById_found() throws Exception {
		mockMvc.perform(get("/api/teacher/{id}", teacher.getId()).header("Authorization", "Bearer " + token)
				.contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk())
				.andExpect(jsonPath("$.firstName").value("Hélène"));
	}

	@Test
	void testFindById_notFound() throws Exception {
		mockMvc.perform(get("/api/teacher/{id}", 9999).header("Authorization", "Bearer " + token)
				.contentType(MediaType.APPLICATION_JSON)).andExpect(status().isNotFound());
	}

	@Test
	void testFindById_badRequest() throws Exception {
		mockMvc.perform(get("/api/teacher/invalid-id").header("Authorization", "Bearer " + token)
				.contentType(MediaType.APPLICATION_JSON)).andExpect(status().isBadRequest());
	}
}