package com.openclassrooms.starterjwt.mapper;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.services.TeacherService;
import com.openclassrooms.starterjwt.services.UserService;

class SessionMapperTest {

	private SessionMapper sessionMapper;

	private TeacherService teacherService;
	private UserService userService;

	@BeforeEach
	void setUp() {
		teacherService = mock(TeacherService.class);
		userService = mock(UserService.class);

		sessionMapper = Mappers.getMapper(SessionMapper.class);
		sessionMapper.teacherService = teacherService;
		sessionMapper.userService = userService;
	}

	@Test
	void testToEntity_mapsDtoToEntityCorrectly() {
		SessionDto dto = new SessionDto();
		dto.setName("Yoga Zen");
		dto.setDescription("Détente");
		dto.setTeacher_id(1L);
		dto.setUsers(Arrays.asList(10L, 20L));

		Teacher teacher = new Teacher();
		teacher.setId(1L);
		User user1 = new User();
		user1.setId(10L);
		User user2 = new User();
		user2.setId(20L);

		when(teacherService.findById(1L)).thenReturn(teacher);
		when(userService.findById(10L)).thenReturn(user1);
		when(userService.findById(20L)).thenReturn(user2);

		Session session = sessionMapper.toEntity(dto);

		assertNotNull(session);
		assertEquals("Détente", session.getDescription());
		assertEquals(teacher, session.getTeacher());
		assertEquals(2, session.getUsers().size());
		assertTrue(session.getUsers().contains(user1));
		assertTrue(session.getUsers().contains(user2));
	}

	@Test
	void testToDto_mapsEntityToDtoCorrectly() {
		Teacher teacher = new Teacher();
		teacher.setId(2L);

		User user = new User();
		user.setId(99L);

		Session session = new Session();
		session.setId(123L);
		session.setName("Test");
		session.setDescription("Cours");
		session.setTeacher(teacher);
		session.setUsers(Collections.singletonList(user));

		SessionDto dto = sessionMapper.toDto(session);

		assertNotNull(dto);
		assertEquals("Cours", dto.getDescription());
		assertEquals(2L, dto.getTeacher_id());
		assertEquals(1, dto.getUsers().size());
		assertEquals(99L, dto.getUsers().get(0));
	}

	@Test
	void testToEntityList_mapsCorrectly() {
		SessionDto dto = new SessionDto();
		dto.setId(1L);
		dto.setName("Méditation");
		dto.setDescription("Relaxation");
		dto.setTeacher_id(10L);
		dto.setUsers(List.of(100L, 101L));

		Teacher teacher = new Teacher();
		teacher.setId(10L);
		User user1 = new User();
		user1.setId(100L);
		User user2 = new User();
		user2.setId(101L);

		when(teacherService.findById(10L)).thenReturn(teacher);
		when(userService.findById(100L)).thenReturn(user1);
		when(userService.findById(101L)).thenReturn(user2);

		List<Session> entities = sessionMapper.toEntity(List.of(dto));

		assertEquals(1, entities.size());
		Session session = entities.get(0);
		assertEquals("Méditation", session.getName());
		assertEquals("Relaxation", session.getDescription());
		assertEquals(teacher, session.getTeacher());
		assertEquals(2, session.getUsers().size());
	}

	@Test
	void testToDtoList_mapsCorrectly() {
		Teacher teacher = new Teacher();
		teacher.setId(55L);

		User user = new User();
		user.setId(77L);

		Session session = new Session();
		session.setId(5L);
		session.setName("Pilates");
		session.setDescription("Intense");
		session.setTeacher(teacher);
		session.setUsers(List.of(user));

		List<SessionDto> dtos = sessionMapper.toDto(List.of(session));

		assertEquals(1, dtos.size());
		SessionDto dto = dtos.get(0);
		assertEquals("Pilates", dto.getName());
		assertEquals("Intense", dto.getDescription());
		assertEquals(55L, dto.getTeacher_id());
		assertEquals(1, dto.getUsers().size());
		assertEquals(77L, dto.getUsers().get(0));
	}
	
	@Test
	void testToEntityList_empty() {
	    List<Session> result = sessionMapper.toEntity(Collections.emptyList());
	    assertNotNull(result);
	    assertTrue(result.isEmpty());
	}

}
