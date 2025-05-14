package com.openclassrooms.starterjwt.mapper;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.models.User;

class UserMapperTest {

	private UserMapper userMapper;

	@BeforeEach
	void setUp() {
		userMapper = Mappers.getMapper(UserMapper.class);
	}

	@Test
	void testToDto_mapsCorrectly() {
		User user = new User();
		user.setId(1L);
		user.setEmail("test@example.com");
		user.setFirstName("Chaima");
		user.setLastName("Yoga");
		user.setPassword("hashed");
		user.setAdmin(true);

		UserDto dto = userMapper.toDto(user);

		assertNotNull(dto);
		assertEquals(1L, dto.getId());
		assertEquals("test@example.com", dto.getEmail());
		assertEquals("Chaima", dto.getFirstName());
		assertEquals("Yoga", dto.getLastName());
		assertTrue(dto.isAdmin());
	}

	@Test
	void testToEntity_mapsCorrectly() {
		UserDto dto = new UserDto();
		dto.setId(1L);
		dto.setEmail("chaima@example.com");
		dto.setFirstName("Chaima");
		dto.setLastName("Yoga");
		dto.setPassword("plain");
		dto.setAdmin(false);

		User user = userMapper.toEntity(dto);

		assertNotNull(user);
		assertEquals(1L, user.getId());
		assertEquals("chaima@example.com", user.getEmail());
		assertEquals("Chaima", user.getFirstName());
		assertEquals("Yoga", user.getLastName());
		assertFalse(user.isAdmin());
	}
	
	@Test
	void testToEntityList_mapsCorrectly() {
	    UserDto dto1 = new UserDto();
	    dto1.setId(1L);
	    dto1.setEmail("a@example.com");
	    dto1.setFirstName("Alice");
	    dto1.setLastName("Dupont");
	    dto1.setPassword("pass1");
	    dto1.setAdmin(false);

	    UserDto dto2 = new UserDto();
	    dto2.setId(2L);
	    dto2.setEmail("b@example.com");
	    dto2.setFirstName("Bob");
	    dto2.setLastName("Martin");
	    dto2.setPassword("pass2");
	    dto2.setAdmin(true);

	    List<User> list = userMapper.toEntity(java.util.List.of(dto1, dto2));

	    assertEquals(2, list.size());
	    assertEquals("a@example.com", list.get(0).getEmail());
	    assertEquals("b@example.com", list.get(1).getEmail());
	}

	@Test
	void testToDtoList_mapsCorrectly() {
	    User u1 = new User();
	    u1.setId(1L);
	    u1.setEmail("a@example.com");
	    u1.setFirstName("Alice");
	    u1.setLastName("Dupont");
	    u1.setPassword("secret1");
	    u1.setAdmin(false);

	    User u2 = new User();
	    u2.setId(2L);
	    u2.setEmail("b@example.com");
	    u2.setFirstName("Bob");
	    u2.setLastName("Martin");
	    u2.setPassword("secret2");
	    u2.setAdmin(true);

	    List<UserDto> list = userMapper.toDto(java.util.List.of(u1, u2));

	    assertEquals(2, list.size());
	    assertEquals("a@example.com", list.get(0).getEmail());
	    assertEquals("b@example.com", list.get(1).getEmail());
	    assertEquals("Martin", list.get(1).getLastName());
	}
	
	@Test
	void testToEntityList_empty() {
	    List<User> result = userMapper.toEntity(List.of());
	    assertNotNull(result);
	    assertTrue(result.isEmpty());
	}
	
	@Test
	void testToDtoList_empty() {
	    List<UserDto> result = userMapper.toDto(List.of());
	    assertNotNull(result);
	    assertTrue(result.isEmpty());
	}


}