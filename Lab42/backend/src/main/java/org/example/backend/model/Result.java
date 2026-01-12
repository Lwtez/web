package org.example.backend.model;

import jakarta.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Table(name = "results")
public class Result implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double x;
    private double y;
    private double r;
    private boolean hit;

    private double executionTime;

    private String owner;

    public Result() {}

    public Result(double x, double y, double r, boolean hit, double executionTime, String owner) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.hit = hit;
        this.executionTime = executionTime;
        this.owner = owner;
    }

    public double getX() { return x; }
    public double getY() { return y; }
    public double getR() { return r; }
    public boolean isHit() { return hit; }
    public String getHitString() { return hit ? "Да" : "Нет"; }
    public double getExecutionTime() { return executionTime; }
    public String getOwner() {return owner;}
    public void setX(double x) {this.x = x; }
    public void setY(double y) {this.y = y; }
    public void setR(double r) {this.r = r; }
    public void setHit(boolean hit) {this.hit = hit;}
    public void setExecutionTime(double executionTime) { this.executionTime = executionTime; }
    public void setOwner(String owner) {this.owner = owner;}
}