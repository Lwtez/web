package org.example;

import javax.persistence.*;
import java.io.Serializable;
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

    @Temporal(TemporalType.TIMESTAMP)
    private Date checkDate;

    private long executionTime;

    public Result() {}

    public Result(double x, double y, double r, boolean hit, long executionTime) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.hit = hit;
        this.checkDate = new Date();
        this.executionTime = executionTime;
    }

    public double getX() { return x; }
    public double getY() { return y; }
    public double getR() { return r; }
    public boolean isHit() { return hit; }
    public Date getCheckDate() { return checkDate; }
    public String getHitString() { return hit ? "Да" : "Нет"; }
    public long getExecutionTime() { return executionTime; }
    public void setExecutionTime(long executionTime) { this.executionTime = executionTime; }
}