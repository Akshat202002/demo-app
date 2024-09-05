package com.akshat.todo_backend.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.akshat.todo_backend.model.Todo;

public interface TodoRepository extends JpaRepository<Todo, Long> {

}
