package org.example.backend.service;


import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.example.backend.model.User;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;

@Stateless
public class UserService {
    @PersistenceContext(unitName = "Lab4PU")
    private EntityManager em;

    public boolean register(String login, String password) {
        if (login == null || password == null || login.isEmpty()) return false;
        if (em.find(User.class, login) != null) return false;
        User user = new User();
        user.setLogin(login);
        user.setPassword(hash(password));
        em.persist(user);
        em.flush();
        return true;
    }

    public boolean login(String login, String password) {
        User user = em.find(User.class, login);
        return user != null && user.getPassword().equals(hash(password));
    }

    private String hash(String password) {
        if (password == null) return "null_pwd";
        return String.valueOf(password.hashCode());
    }
}
