package com.akshat.todo_backend.repository;

import com.akshat.todo_backend.model.Todo;
import jakarta.persistence.EntityManagerFactory;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.stubbing.Answer;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class TodoRepositoryTest {

    @Mock
    private EntityManagerFactory entityManagerFactory;

    @Mock
    private SessionFactory sessionFactory;

    @Mock
    private Session session;

    @InjectMocks
    private TodoRepository todoRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        when(entityManagerFactory.unwrap(SessionFactory.class)).thenReturn(sessionFactory);
        when(sessionFactory.openSession()).thenReturn(session);
    }

    @Test
    void testFindAll() {
        List<Todo> expectedTodos = List.of(new Todo(), new Todo());
        when(session.createQuery("from Todo", Todo.class)).thenReturn(mock(org.hibernate.query.Query.class));
        when(session.createQuery("from Todo", Todo.class).list()).thenReturn(expectedTodos);

        List<Todo> actualTodos = todoRepository.findAll();
        assertEquals(expectedTodos, actualTodos);

        verify(sessionFactory).openSession();
        verify(session).close();
    }

    @Test
    void testFindById() {
        Long id = 1L;
        Todo todo = new Todo();
        when(session.get(Todo.class, id)).thenReturn(todo);

        Optional<Todo> result = todoRepository.findById(id);
        assertTrue(result.isPresent());
        assertEquals(todo, result.get());

        verify(sessionFactory).openSession();
        verify(session).close();
    }

    @Test
    void testSaveNewTodo() {
        Todo todo = new Todo();
        todo.setId(null); // New Todo, without an ID
        doAnswer((Answer<Void>) invocation -> {
            todo.setId(1L);
            return null;
        }).when(session).persist(todo);

        Todo savedTodo = todoRepository.save(todo);
        assertNotNull(savedTodo.getId());

        verify(sessionFactory).openSession();
        verify(session).beginTransaction();
        verify(session).persist(todo);
        verify(session).getTransaction().commit();
        verify(session).close();
    }

    @Test
    void testSaveExistingTodo() {
        Todo todo = new Todo();
        todo.setId(1L); // Existing Todo
        when(session.merge(todo)).thenReturn(todo);

        Todo savedTodo = todoRepository.save(todo);
        assertEquals(1L, savedTodo.getId());

        verify(sessionFactory).openSession();
        verify(session).beginTransaction();
        verify(session).merge(todo);
        verify(session).getTransaction().commit();
        verify(session).close();
    }

    @Test
    void testDeleteById() {
        Long id = 1L;
        Todo todo = new Todo();
        when(session.get(Todo.class, id)).thenReturn(todo);

        todoRepository.deleteById(id);

        verify(sessionFactory).openSession();
        verify(session).beginTransaction();
        verify(session).get(Todo.class, id);
        verify(session).remove(todo);
        verify(session).getTransaction().commit();
        verify(session).close();
    }

    @Test
    void testSearchTodos() {
        String keyword = "test";
        List<Todo> expectedTodos = List.of(new Todo(), new Todo());
        when(session.createQuery("from Todo t where t.name like :keyword or t.description like:keyword", Todo.class))
                .thenReturn(mock(org.hibernate.query.Query.class));
        when(session.createQuery("from Todo t where t.name like :keyword or t.description like:keyword", Todo.class)
                .setParameter("keyword", "%" + keyword + "%").list()).thenReturn(expectedTodos);

        List<Todo> actualTodos = todoRepository.searchTodos(keyword);
        assertEquals(expectedTodos, actualTodos);

        verify(sessionFactory).openSession();
        verify(session).close();
    }
}
