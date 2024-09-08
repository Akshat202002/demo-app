package com.akshat.todo_backend.repository;
import com.akshat.todo_backend.model.Todo;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TodoRepository extends JpaRepository<Todo, Long> {
    @Query("SELECT t FROM Todo t WHERE t.name LIKE %:keyword% OR t.description LIKE %:keyword%")
    List<Todo> searchTodos(@Param("keyword") String keyword);
}
