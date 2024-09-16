package com.akshat.todo_backend.service;

import com.akshat.todo_backend.model.Todo;
import com.akshat.todo_backend.repository.TodoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

public class TodoServiceTest {

    @InjectMocks
    private TodoService todoService;

    @Mock
    private TodoRepository todoRepository;

    private Todo todo;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
        todo = new Todo();
        todo.setId(1L);
        todo.setName("Test Task");
        todo.setDescription("Test Description");
        todo.setCompleted(false);
    }

    @Test
    public void testGetAllTodos() {
        when(todoRepository.findAll()).thenReturn(Arrays.asList(todo));

        List<Todo> todos = todoService.getAllTodos();
        assertEquals(1, todos.size());
        assertEquals("Test Task", todos.get(0).getName());
    }

    @Test
    public void testGetTodoById() {
        when(todoRepository.findById(anyLong())).thenReturn(Optional.of(todo));

        Optional<Todo> foundTodo = todoService.getTodoById(1L);
        assertTrue(foundTodo.isPresent());
        assertEquals("Test Task", foundTodo.get().getName());
    }

    @Test
    public void testCreateOrUpdateTodo() {
        when(todoRepository.save(any(Todo.class))).thenReturn(todo);

        Todo savedTodo = todoService.createOrUpdateTodo(todo);
        assertEquals("Test Task", savedTodo.getName());
    }

    @Test
    public void testDeleteTodoById() {
        doNothing().when(todoRepository).deleteById(anyLong());

        todoService.deleteTodoById(1L);
        verify(todoRepository, times(1)).deleteById(1L);
    }

    @Test
    public void testSearchTodos() {
        when(todoRepository.searchTodos(any(String.class))).thenReturn(Arrays.asList(todo));

        List<Todo> todos = todoService.searchTodos("Test");
        assertEquals(1, todos.size());
        assertEquals("Test Task", todos.get(0).getName());
    }
}