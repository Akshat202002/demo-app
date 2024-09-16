package com.akshat.todo_backend.repository;

import com.akshat.todo_backend.model.Todo;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManagerFactory;
import java.util.List;
import java.util.Optional;

@Repository
public class TodoRepository {

    private final SessionFactory sessionFactory;

    @Autowired
    public TodoRepository(EntityManagerFactory factory) {
        this.sessionFactory = factory.unwrap(SessionFactory.class);
    }

    @Transactional(readOnly = true)
    public List<Todo> findAll() {
        try (Session session = sessionFactory.openSession()) {
            return session.createQuery("from Todo", Todo.class).list();
        }
    }

    @Transactional(readOnly = true)
    public Optional<Todo> findById(Long id) {
        try (Session session = sessionFactory.openSession()) {
            return Optional.ofNullable(session.get(Todo.class, id));
        }
    }

    @Transactional
    public Todo save(Todo todo) {
        try (Session session = sessionFactory.openSession()) {
            session.beginTransaction();
            if (todo.getId() == null) {
                session.persist(todo);
            } else {
                session.merge(todo);
            }
            session.getTransaction().commit();
            return todo;
        }
    }

    @Transactional
    public void deleteById(Long id) {
        try (Session session = sessionFactory.openSession()) {
            session.beginTransaction();
            Todo todo = session.get(Todo.class, id);
            if (todo != null) {
                session.remove(todo);
            }
            session.getTransaction().commit();
        }
    }

    @Transactional(readOnly = true)
    public List<Todo> searchTodos(String keyword) {
        try (Session session = sessionFactory.openSession()) {
            return session
                    .createQuery("from Todo t where t.name like :keyword or t.description like:keyword", Todo.class)
                    .setParameter("keyword", "%" + keyword + "%").list();
        }
    }

    // Using Criteria API
    // @Transactional(readOnly = true)
    // public List<Todo> searchTodos(String keyword) {
    // try (Session session = sessionFactory.openSession()) {
    // return session.createQuery(
    // "from Todo t where t.name like :keyword or t.description like :keyword",
    // Todo.class)
    // .setParameter("keyword", "%" + keyword + "%")
    // .list();
    // }
    // }
}