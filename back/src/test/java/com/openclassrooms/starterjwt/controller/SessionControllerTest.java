package com.openclassrooms.starterjwt.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.http.ResponseEntity;

import com.openclassrooms.starterjwt.controllers.SessionController;
import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.mapper.SessionMapper;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.services.SessionService;

@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
class SessionControllerTest {

	@Mock
	private SessionService sessionService;

	@Mock
	private SessionMapper sessionMapper;

	@InjectMocks
	private SessionController sessionController;

	private Session session;
	private SessionDto sessionDto;

	@BeforeEach
	void setUp() {
		session = new Session();
		session.setId(1L);
		session.setName("Test Session");

		sessionDto = new SessionDto();
		sessionDto.setId(1L);
		sessionDto.setName("Test Session");
	}

	@Test
	void findById_validId_returnsOk() {
		when(sessionService.getById(1L)).thenReturn(session);
		when(sessionMapper.toDto(session)).thenReturn(sessionDto);

		ResponseEntity<?> response = sessionController.findById("1");

		assertEquals(200, response.getStatusCodeValue());
		assertEquals(sessionDto, response.getBody());
	}

	@Test
	void findById_notFound_returns404() {
		when(sessionService.getById(99L)).thenReturn(null);

		ResponseEntity<?> response = sessionController.findById("99");

		assertEquals(404, response.getStatusCodeValue());
	}

	@Test
	void findById_invalidId_returns400() {
		ResponseEntity<?> response = sessionController.findById("abc");

		assertEquals(400, response.getStatusCodeValue());
	}

	@Test
	void findAll_returnsList() {
		when(sessionService.findAll()).thenReturn(List.of(session));
		when(sessionMapper.toDto(List.of(session))).thenReturn(List.of(sessionDto));

		ResponseEntity<?> response = sessionController.findAll();

		assertEquals(200, response.getStatusCodeValue());
		assertEquals(List.of(sessionDto), response.getBody());
	}

	@Test
	void create_returnsOk() {
		when(sessionMapper.toEntity(sessionDto)).thenReturn(session);
		when(sessionService.create(session)).thenReturn(session);
		when(sessionMapper.toDto(session)).thenReturn(sessionDto);

		ResponseEntity<?> response = sessionController.create(sessionDto);

		assertEquals(200, response.getStatusCodeValue());
		assertEquals(sessionDto, response.getBody());
	}

	@Test
	void update_valid_returnsOk() {
		when(sessionMapper.toEntity(sessionDto)).thenReturn(session);
		when(sessionService.update(1L, session)).thenReturn(session);
		when(sessionMapper.toDto(session)).thenReturn(sessionDto);

		ResponseEntity<?> response = sessionController.update("1", sessionDto);

		assertEquals(200, response.getStatusCodeValue());
		assertEquals(sessionDto, response.getBody());
	}

	@Test
	void update_invalidId_returns400() {
		ResponseEntity<?> response = sessionController.update("bad_id", sessionDto);

		assertEquals(400, response.getStatusCodeValue());
	}

	@Test
	void delete_valid_returnsOk() {
		when(sessionService.getById(1L)).thenReturn(session);

		ResponseEntity<?> response = sessionController.save("1");

		assertEquals(200, response.getStatusCodeValue());
		verify(sessionService).delete(1L);
	}

	@Test
	void delete_notFound_returns404() {
		when(sessionService.getById(999L)).thenReturn(null);

		ResponseEntity<?> response = sessionController.save("999");

		assertEquals(404, response.getStatusCodeValue());
	}

	@Test
	void participate_valid_returnsOk() {
		ResponseEntity<?> response = sessionController.participate("1", "10");

		assertEquals(200, response.getStatusCodeValue());
		verify(sessionService).participate(1L, 10L);
	}

	@Test
	void participate_invalid_returns400() {
		ResponseEntity<?> response = sessionController.participate("bad", "id");

		assertEquals(400, response.getStatusCodeValue());
	}

	@Test
	void noLongerParticipate_valid_returnsOk() {
		ResponseEntity<?> response = sessionController.noLongerParticipate("1", "10");

		assertEquals(200, response.getStatusCodeValue());
		verify(sessionService).noLongerParticipate(1L, 10L);
	}

	@Test
	void noLongerParticipate_invalid_returns400() {
		ResponseEntity<?> response = sessionController.noLongerParticipate("??", "!!");

		assertEquals(400, response.getStatusCodeValue());
	}
}