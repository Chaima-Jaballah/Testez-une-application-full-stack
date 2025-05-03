package com.openclassrooms.starterjwt.mapper;

import com.openclassrooms.starterjwt.dto.TeacherDto;
import com.openclassrooms.starterjwt.models.Teacher;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class TeacherMapperTest {

    private TeacherMapper teacherMapper;

    @BeforeEach
    void setUp() {
        teacherMapper = Mappers.getMapper(TeacherMapper.class);
    }

    @Test
    void testToDto_shouldMapCorrectly() {
        Teacher teacher = new Teacher();
        teacher.setId(1L);
        teacher.setFirstName("Hélène");
        teacher.setLastName("Thiercelin");

        TeacherDto dto = teacherMapper.toDto(teacher);

        assertNotNull(dto);
        assertEquals(1L, dto.getId());
        assertEquals("Hélène", dto.getFirstName());
        assertEquals("Thiercelin", dto.getLastName());
    }

    @Test
    void testToEntity_shouldMapCorrectly() {
        TeacherDto dto = new TeacherDto();
        dto.setId(2L);
        dto.setFirstName("Margot");
        dto.setLastName("Delahaye");

        Teacher entity = teacherMapper.toEntity(dto);

        assertNotNull(entity);
        assertEquals(2L, entity.getId());
        assertEquals("Margot", entity.getFirstName());
        assertEquals("Delahaye", entity.getLastName());
    }

    @Test
    void testToDtoList_shouldMapCorrectly() {
        Teacher t1 = new Teacher(); t1.setId(1L); t1.setFirstName("A"); t1.setLastName("X");
        Teacher t2 = new Teacher(); t2.setId(2L); t2.setFirstName("B"); t2.setLastName("Y");

        List<TeacherDto> dtos = teacherMapper.toDto(List.of(t1, t2));

        assertEquals(2, dtos.size());
        assertEquals("A", dtos.get(0).getFirstName());
        assertEquals("Y", dtos.get(1).getLastName());
    }

    @Test
    void testToEntityList_shouldMapCorrectly() {
        TeacherDto d1 = new TeacherDto(); d1.setId(1L); d1.setFirstName("A"); d1.setLastName("X");
        TeacherDto d2 = new TeacherDto(); d2.setId(2L); d2.setFirstName("B"); d2.setLastName("Y");

        List<Teacher> entities = teacherMapper.toEntity(List.of(d1, d2));

        assertEquals(2, entities.size());
        assertEquals("B", entities.get(1).getFirstName());
        assertEquals("X", entities.get(0).getLastName());
    }
}
