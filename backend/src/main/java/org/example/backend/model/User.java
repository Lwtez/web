package org.example.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.io.Serializable;

@Entity
@Table(name = "users")
public class User implements Serializable {
    @Id
    private String login;
    private String password;

    public User() {}

    public String getLogin() {return  login;}
    public String getPassword() {return password;}
    public void setLogin(String login) {this.login = login;}
    public void setPassword(String password) {this.password = password;}
}
