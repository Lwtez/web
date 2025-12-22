package org.example;

import org.example.Result;
import javax.faces.bean.ApplicationScoped;
import javax.faces.bean.ManagedBean;
import javax.persistence.*;
import java.util.List;


public class ResultsBean {
    private EntityManagerFactory emf;
    private EntityManager em;

    public void clear() {
        try {
            em.getTransaction().begin();
            em.createQuery("DELETE FROM Result").executeUpdate();
            em.getTransaction().commit();
        } catch (Exception e) {
            if (em.getTransaction().isActive()) {
                em.getTransaction().rollback();
            }
            e.printStackTrace();
        }
    }

    public ResultsBean() {
        emf = Persistence.createEntityManagerFactory("CheckPointPU");
        em = emf.createEntityManager();
    }

    public void addResult(Result result) {
        em.getTransaction().begin();
        em.persist(result);
        em.getTransaction().commit();
    }

    public List<Result> getAllResults() {
        return em.createQuery("SELECT r FROM Result r ORDER BY r.checkDate DESC", Result.class).getResultList();
    }
}