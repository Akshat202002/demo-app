package com.akshat.todo_backend.controller;

import com.akshat.todo_backend.model.Todo;
import com.akshat.todo_backend.service.TodoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Arrays;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TodoController.class)
public class TodoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TodoService todoService;

    private Todo todo;

    @BeforeEach
    public void setup() {
        todo = new Todo();
        todo.setId(1L);
        todo.setName("Test Task");
        todo.setDescription("Test Description");
        todo.setCompleted(false);
    }

    @Test
    public void testGetAllTodos() throws Exception {
        when(todoService.getAllTodos()).thenReturn(Arrays.asList(todo));

        mockMvc.perform(get("/api/todos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Test Task"));
    }

    @Test
    public void testGetTodoById() throws Exception {
        when(todoService.getTodoById(anyLong())).thenReturn(Optional.of(todo));

        mockMvc.perform(get("/api/todos/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Test Task"));
    }

    @Test
    public void testCreateTodo() throws Exception {
        when(todoService.createOrUpdateTodo(any(Todo.class))).thenReturn(todo);

        mockMvc.perform(post("/api/todos")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"Test Task\",\"description\":\"Test Description\",\"completed\":false}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Test Task"));
    }

    @Test
    public void testUpdateTodo() throws Exception {
        when(todoService.createOrUpdateTodo(any(Todo.class))).thenReturn(todo);

        mockMvc.perform(put("/api/todos/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"Updated Task\",\"description\":\"Updated Description\",\"completed\":true}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Test Task"));
    }

    @Test
    public void testDeleteTodo() throws Exception {
        mockMvc.perform(delete("/api/todos/1"))
                .andExpect(status().isOk());
    }

    @Test
    public void testSearchTodos() throws Exception {
        when(todoService.searchTodos(any(String.class))).thenReturn(Arrays.asList(todo));

        mockMvc.perform(get("/api/todos/search?keyword=Test"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Test Task"));
    }
}