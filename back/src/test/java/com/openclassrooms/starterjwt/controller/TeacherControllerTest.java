package com.openclassrooms.starterjwt.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.http.ResponseEntity;

import com.openclassrooms.starterjwt.controllers.TeacherController;
import com.openclassrooms.starterjwt.dto.TeacherDto;
import com.openclassrooms.starterjwt.mapper.TeacherMapper;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.services.TeacherService;

@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
class TeacherControllerTest {

	@Mock
	private TeacherService teacherService;

	@Mock
	private TeacherMapper teacherMapper;

	@InjectMocks
	private TeacherController teacherController;

	private Teacher teacher;
	private TeacherDto teacherDto;

	@BeforeEach
	void setUp() {
		teacher = new Teacher();
		teacher.setId(1L);
		teacher.setFirstName("Hélène");
		teacher.setLastName("THIERCELIN");

		teacherDto = new TeacherDto();
		teacherDto.setId(1L);
		teacherDto.setFirstName("Hélène");
		teacherDto.setLastName("THIERCELIN");
	}

	@Test
	void findById_validId_returnsTeacher() {
		when(teacherService.findById(1L)).thenReturn(teacher);
		when(teacherMapper.toDto(teacher)).thenReturn(teacherDto);

		ResponseEntity<?> response = teacherController.findById("1");

		assertEquals(200, response.getStatusCodeValue());
		assertEquals(teacherDto, response.getBody());
	}

	@Test
	void findById_notFound_returns404() {
		when(teacherService.findById(99L)).thenReturn(null);

		ResponseEntity<?> response = teacherController.findById("99");

		assertEquals(404, response.getStatusCodeValue());
	}

	@Test
	void findById_invalidId_returns400() {
		ResponseEntity<?> response = teacherController.findById("abc");

		assertEquals(400, response.getStatusCodeValue());
	}

	@Test
	void findAll_returnsList() {
		when(teacherService.findAll()).thenReturn(List.of(teacher));
		when(teacherMapper.toDto(List.of(teacher))).thenReturn(List.of(teacherDto));

		ResponseEntity<?> response = teacherController.findAll();

		assertEquals(200, response.getStatusCodeValue());
		assertEquals(List.of(teacherDto), response.getBody());
	}
}