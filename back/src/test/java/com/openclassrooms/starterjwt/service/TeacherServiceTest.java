package com.openclassrooms.starterjwt.service;

import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import com.openclassrooms.starterjwt.services.TeacherService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
class TeacherServiceTest {

    @Mock
    private TeacherRepository teacherRepository;

    @InjectMocks
    private TeacherService teacherService;

    private Teacher teacher;

    @BeforeEach
    void setUp() {
        teacher = new Teacher();
        teacher.setId(1L);
        teacher.setFirstName("Hélène");
        teacher.setLastName("Thiercelin");
    }

    @Test
    void testFindAll() {
        when(teacherRepository.findAll()).thenReturn(List.of(teacher));

        List<Teacher> result = teacherService.findAll();

        assertEquals(1, result.size());
        assertEquals("Hélène", result.get(0).getFirstName());
    }

    @Test
    void testFindById_Found() {
        when(teacherRepository.findById(1L)).thenReturn(Optional.of(teacher));

        Teacher result = teacherService.findById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
    }

    @Test
    void testFindById_NotFound() {
        when(teacherRepository.findById(1L)).thenReturn(Optional.empty());

        Teacher result = teacherService.findById(1L);

        assertNull(result);
    }
    
    public Teacher findById(Long id) {
        Optional<Teacher> teacher = teacherRepository.findById(id);
        return teacher.orElse(null);
    }

}