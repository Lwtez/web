package org.example;

import org.example.Result;
import javax.faces.context.FacesContext;
import java.io.Serializable;

public class PointBean implements Serializable {
    private double x;
    private double y;
    private double r = 1.0;

    private ResultsBean resultsBean;

    public void check() {

        long start = System.nanoTime();
        boolean isHit = checkArea(x, y, r);
        long end = System.nanoTime();
        long executionTime = end - start;
        Result res = new Result(x, y, r, isHit, executionTime);

        resultsBean.addResult(res);
    }

    private boolean checkArea(double x, double y, double r) {
        // 1. Четверть II (Треугольник)
        if (x <= 0 && y >= 0) {
            return y <= (0.5 * x + r / 2.0);
        }
        // 2. Четверть III (Прямоугольник)
        if (x <= 0 && y <= 0) {
            return (x >= -r && y >= -r / 2.0);
        }
        // 3. Четверть IV (Сектор)
        if (x >= 0 && y <= 0) {
            return (x * x + y * y <= r * r);
        }
        return false;
    }

    public double getX() { return x; }
    public void setX(double x) { this.x = x; }
    public double getY() { return y; }
    public void setY(double y) { this.y = y; }
    public double getR() { return r; }
    public void setR(double r) { this.r = r; }
    public void setResultsBean(ResultsBean resultsBean) { this.resultsBean = resultsBean; }
}