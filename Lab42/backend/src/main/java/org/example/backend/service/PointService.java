package org.example.backend.service;

import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.example.backend.model.Result;

import java.util.List;

@Stateless
public class PointService {

    @PersistenceContext(unitName = "Lab4PU")
    private EntityManager em;

    public Result checkAndSave(double x, double y, double r, String owner) {
        long start = System.nanoTime();
        boolean isHit = false;
        if (r > 0) {
            if (x <= 0 && y >= 0 && x >= -r / 2.0 && y <= r) { // II: Прямоугольник
                isHit = true;
            } else if (x >= 0 && y >= 0 && y <= -x / 2.0 + r / 2.0) { // I: Треугольник
                isHit = true;
            } else if (x >= 0 && y <= 0 && x * x + y * y <= (r / 2.0) * (r / 2.0)) { // IV: Сектор
                isHit = true;
            }
        }
        long end = System.nanoTime();

        Result res = new Result();
        res.setX(x);
        res.setY(y);
        res.setR(r);
        res.setOwner(owner);
        res.setHit(isHit);
        res.setExecutionTime((end - start)/1000.0);

        em.persist(res);
        em.flush();

        return res;
    }


    public List<Result> getHistory(String owner) {
        return em.createQuery("SELECT r FROM Result r WHERE r.owner = :owner ORDER BY r.id DESC", Result.class)
                .setParameter("owner", owner)
                .getResultList();
    }

    public void deleteAll(String owner) {
        Query query = em.createQuery("DELETE FROM Result r WHERE r.owner = :owner");
        query.setParameter("owner", owner).executeUpdate();
    }
}
