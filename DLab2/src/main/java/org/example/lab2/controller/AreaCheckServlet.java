package org.example.lab2.controller;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.example.lab2.model.Result;
import org.example.lab2.model.ResultBean;

import java.io.IOException;
import java.io.PrintWriter;

@WebServlet("/areaCheck")
public class AreaCheckServlet extends HttpServlet {
    private boolean checkHit(Float x, Float y, Float r) {
        if (x > 0 && y > 0 && x*x + y*y <= r*r/4) {
            return true;
        } else if (x > 0 && y < 0 && x <= r/2 && y >= -r) {
            return true;
        } else if (x < 0 && y < 0 && -x + r >= y) {
            return true;
        } else {
            return false;
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String reqx = request.getParameter("x");
        String reqy = request.getParameter("y");
        String reqr = request.getParameter("r");

        float x;
        float y;
        float r;
        String xStr;
        String yStr;
        String rStr;

        boolean parse = true;

        try {
            x = Float.parseFloat(reqx);
            y = Float.parseFloat(reqy);
            r = Float.parseFloat(reqr);
            xStr = reqx;
            yStr = reqy;
            rStr = reqr;
        } catch (Exception e) {
            parse = false;
            x = y = r = 0;
            xStr = yStr = rStr = "0";
        }

        response.setContentType("text/html;charset=UTF-8");
        PrintWriter pw = response.getWriter();

        if (!parse) {
            pw.println("<html><body>");
            pw.println("<p>Неверные параметры.</p>");
            pw.println("<a href=\"/\">Вернуться к форме</a>");
            pw.println("</body></html>");
            return;
        }

        long startTime = System.nanoTime();

        boolean check = checkHit(x, y, r);

        long endTime = System.nanoTime();
        long executionTime = endTime - startTime;

        ResultBean bean = (ResultBean) getServletContext().getAttribute("resultsBean");
        if (bean != null) {
            bean.add(new Result(xStr, yStr, rStr, check, executionTime));
        }

        request.getRequestDispatcher("/Results.jsp").forward(request, response);
    }
}
