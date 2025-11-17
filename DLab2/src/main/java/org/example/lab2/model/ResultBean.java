package org.example.lab2.model;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class ResultBean {

    private final List<Result> list = Collections.synchronizedList(new ArrayList<>());

    public void add(Result e) {
        list.add(0, e);
    }

    public Result getLast() {
        return list.get(0);
    }

    public List<Result> getAll() {
        synchronized(list) {
            return new ArrayList<>(list);
        }
    }
}
