package org.example.lab2.model;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class Result {
    private final String x;
    private final String y;
    private final String r;
    private final boolean hit;
    private final String timestamp;
    private final long executionTime;

    public Result(String x, String y, String r, boolean hit, long executionTime) {
        this.x = x; this.y = y; this.r = r; this.hit = hit;
        this.executionTime = executionTime;
        this.timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
    }

    public String getX() { return x; }
    public String getY() { return y; }
    public String getR() { return r; }
    public boolean isHit() { return hit; }
    public String getTimestamp() { return timestamp; }
    public double getExecutionTimeMs() { return executionTime / 1_000_000.0; }
}
