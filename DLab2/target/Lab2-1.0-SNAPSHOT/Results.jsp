<%@ page import="org.example.lab2.model.ResultBean" %>
<%@ page import="org.example.lab2.model.Result" %>
<%@ page import="java.util.List" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Результаты</title>
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/static/css/Results.css">
</head>
<body>
<h1>Результаты</h1>
<table id="resultTable" cellsacing="6">
    <thead>
    <tr>
        <th>Координата X</th>
        <th>Координата Y</th>
        <th>Радиус R</th>
        <th>Факт попадания в область</th>
        <th>Текущее время</th>
        <th>Время выполнения скрипта (ms)</th>
    </tr>
    </thead>
    <tbody>
    <%
        ResultBean bean = (ResultBean) application.getAttribute("resultsBean");

        if (bean != null && !bean.getAll().isEmpty()) {
            Result lastResult = bean.getLast();
            if (lastResult != null) {
    %>
    <tr>
        <td><%= lastResult.getX() %></td>
        <td><%= lastResult.getY() %></td>
        <td><%= lastResult.getR() %></td>
        <td><strong><%= lastResult.isHit() ? "попал" : "мимо" %></strong></td>
        <td><%= lastResult.getTimestamp() %></td>
        <td><%= String.format("%f", lastResult.getExecutionTimeMs()) %></td>
    </tr>
    <% }
    } else {
    %>
    <tr>
        <td colspan="6" style="text-align: center;">Нет данных для отображения</td>
    </tr>
    <%
        }
    %>
    </tbody>
</table>
<a href="controller">
    Вернуться к форме ввода
</a>
</body>
</html>