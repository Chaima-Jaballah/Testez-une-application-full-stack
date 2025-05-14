package com.openclassrooms.starterjwt.service;

import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.services.SessionService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
class SessionServiceTest {

    @Mock
    private SessionRepository sessionRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private SessionService sessionService;

    private Session session;
    private User user;

    @BeforeEach
    void setUp() {
        session = new Session();
        session.setId(1L);
        session.setUsers(new ArrayList<>());

        user = new User();
        user.setId(2L);
    }

    @Test
    void testCreate() {
        when(sessionRepository.save(session)).thenReturn(session);
        Session result = sessionService.create(session);
        assertEquals(session, result);
    }

    @Test
    void testDelete() {
        sessionService.delete(1L);
        verify(sessionRepository).deleteById(1L);
    }

    @Test
    void testFindAll() {
        when(sessionRepository.findAll()).thenReturn(List.of(session));
        List<Session> result = sessionService.findAll();
        assertEquals(1, result.size());
    }

    @Test
    void testGetById_Found() {
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));
        Session result = sessionService.getById(1L);
        assertEquals(session, result);
    }

    @Test
    void testGetById_NotFound() {
        when(sessionRepository.findById(1L)).thenReturn(Optional.empty());
        Session result = sessionService.getById(1L);
        assertNull(result);
    }

    @Test
    void testUpdate() {
        session.setName("Updated");
        when(sessionRepository.save(session)).thenReturn(session);
        Session result = sessionService.update(1L, session);
        assertEquals("Updated", result.getName());
        assertEquals(1L, result.getId());
    }

    @Test
    void testParticipate_Success() {
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));
        when(userRepository.findById(2L)).thenReturn(Optional.of(user));

        sessionService.participate(1L, 2L);

        assertTrue(session.getUsers().contains(user));
        verify(sessionRepository).save(session);
    }

    @Test
    void testParticipate_AlreadyParticipates() {
        session.getUsers().add(user);
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));
        when(userRepository.findById(2L)).thenReturn(Optional.of(user));

        assertThrows(BadRequestException.class, () -> sessionService.participate(1L, 2L));
    }

    @Test
    void testParticipate_NotFound() {
        when(sessionRepository.findById(1L)).thenReturn(Optional.empty());
        when(userRepository.findById(2L)).thenReturn(Optional.of(user));

        assertThrows(NotFoundException.class, () -> sessionService.participate(1L, 2L));
    }

    @Test
    void testNoLongerParticipate_Success() {
        session.getUsers().add(user);
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));

        sessionService.noLongerParticipate(1L, 2L);

        assertFalse(session.getUsers().contains(user));
        verify(sessionRepository).save(session);
    }

    @Test
    void testNoLongerParticipate_NotParticipating() {
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));

        assertThrows(BadRequestException.class, () -> sessionService.noLongerParticipate(1L, 2L));
    }

    @Test
    void testNoLongerParticipate_SessionNotFound() {
        when(sessionRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> sessionService.noLongerParticipate(1L, 2L));
    }
    
    
    @Test
    void testParticipate_UserNotFound() {
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));
        when(userRepository.findById(2L)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> sessionService.participate(1L, 2L));
    }


}

