package com.openclassrooms.starterjwt.controller;

import com.openclassrooms.starterjwt.controllers.UserController;
import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.mapper.UserMapper;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
class UserControllerTest {

    @Mock
    private UserService userService;

    @Mock
    private UserMapper userMapper;

    @InjectMocks
    private UserController userController;

    private User user;
    private UserDto userDto;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setEmail("yoga@studio.com");

        userDto = new UserDto();
        userDto.setId(1L);
        userDto.setEmail("yoga@studio.com");
    }

    @Test
    void findById_validId_returnsUser() {
        when(userService.findById(1L)).thenReturn(user);
        when(userMapper.toDto(user)).thenReturn(userDto);

        ResponseEntity<?> response = userController.findById("1");

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(userDto, response.getBody());
    }

    @Test
    void findById_notFound_returns404() {
        when(userService.findById(999L)).thenReturn(null);

        ResponseEntity<?> response = userController.findById("999");

        assertEquals(404, response.getStatusCodeValue());
    }

    @Test
    void findById_invalidId_returns400() {
        ResponseEntity<?> response = userController.findById("abc");

        assertEquals(400, response.getStatusCodeValue());
    }

    @Test
    void delete_validUser_authenticated_returnsOk() {
        // simulate authenticated user
        UserDetails userDetails = mock(UserDetails.class);
        when(userDetails.getUsername()).thenReturn("yoga@studio.com");

        SecurityContext context = mock(SecurityContext.class);
        when(context.getAuthentication()).thenReturn(
                new TestingAuthenticationToken(userDetails, null)
        );
        SecurityContextHolder.setContext(context);

        when(userService.findById(1L)).thenReturn(user);

        ResponseEntity<?> response = userController.save("1");

        assertEquals(200, response.getStatusCodeValue());
        verify(userService).delete(1L);
    }

    @Test
    void delete_validUser_unauthorized_returns401() {
        UserDetails userDetails = mock(UserDetails.class);
        when(userDetails.getUsername()).thenReturn("unauthorized@user.com");

        SecurityContext context = mock(SecurityContext.class);
        when(context.getAuthentication()).thenReturn(
                new TestingAuthenticationToken(userDetails, null)
        );
        SecurityContextHolder.setContext(context);

        when(userService.findById(1L)).thenReturn(user);

        ResponseEntity<?> response = userController.save("1");

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    }

    @Test
    void delete_userNotFound_returns404() {
        when(userService.findById(99L)).thenReturn(null);

        ResponseEntity<?> response = userController.save("99");

        assertEquals(404, response.getStatusCodeValue());
    }

    @Test
    void delete_invalidId_returns400() {
        ResponseEntity<?> response = userController.save("abc");

        assertEquals(400, response.getStatusCodeValue());
    }
}
