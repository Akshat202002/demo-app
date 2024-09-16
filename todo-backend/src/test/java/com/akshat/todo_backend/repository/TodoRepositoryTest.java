package com.akshat.todo_backend.repository;

import com.akshat.todo_backend.model.Todo;
import org.hibernate.SessionFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import jakarta.persistence.EntityManagerFactory;
import org.hibernate.Session;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class TodoRepositoryTest {

    @InjectMocks
    private TodoRepository todoRepository;

    @Mock
    private EntityManagerFactory entityManagerFactory;

    @Mock
    private SessionFactory sessionFactory;

    @Mock
    private Session session;

    private Todo todo;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
        when(entityManagerFactory.unwrap(SessionFactory.class)).thenReturn(sessionFactory);
        when(sessionFactory.openSession()).thenReturn(session);
        todo = new Todo();
        todo.setId(1L);
        todo.setName("Test Task");
        todo.setDescription("Test Description");
        todo.setCompleted(false);
    }

    @Test
    public void testFindAll() {
        when(session.createQuery(anyString(), eq(Todo.class))).thenReturn(mock(org.hibernate.query.Query.class));
        when(session.createQuery(anyString(), eq(Todo.class)).list()).thenReturn(Arrays.asList(todo));

        List<Todo> todos = todoRepository.findAll();
        assertEquals(1, todos.size());
        assertEquals("Test Task", todos.get(0).getName());
    }

    @Test
    public void testFindById() {
        when(session.get(Todo.class, 1L)).thenReturn(todo);

        Optional<Todo> foundTodo = todoRepository.findById(1L);
        assertTrue(foundTodo.isPresent());
        assertEquals("Test Task", foundTodo.get().getName());
    }

    @Test
    public void testSave() {
        when(session.merge(any(Todo.class))).thenReturn(todo);

        Todo savedTodo = todoRepository.save(todo);
        assertEquals("Test Task", savedTodo.getName());
    }

    @Test
    public void testDeleteById() {
        when(session.get(Todo.class, 1L)).thenReturn(todo);
        doNothing().when(session).remove(any(Todo.class));

        todoRepository.deleteById(1L);
        verify(session, times(1)).remove(todo);
    }

    @Test
    public void testSearchTodos() {
        when(session.createQuery(anyString(), eq(Todo.class))).thenReturn(mock(org.hibernate.query.Query.class));
        when(session.createQuery(anyString(), eq(Todo.class)).setParameter(anyString(), anyString()).list())
                .thenReturn(Arrays.asList(todo));

        List<Todo> todos = todoRepository.searchTodos("Test");
        assertEquals(1, todos.size());
        assertEquals("Test Task", todos.get(0).getName());
    }
}