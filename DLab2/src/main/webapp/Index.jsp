<%@ page import="org.example.lab2.model.ResultBean" %>
<%@ page import="org.example.lab2.model.Result" %>
<%@ page import="java.util.List" %>
<%@ page contentType="text/html;charset=UTF-8"  pageEncoding="UTF-8" language="java" %>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Лабораторная работа №2</title>
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/static/css/Index.css">
</head>
<body>
<header id="pageHeader">
    <h1>Дорош Даниил Денисович</h1>
    <p>P3222</p>
    <p>Вариант - 59009</p>
</header>
<div class="formWindows">
    <div class="lWindow">
        <div class="coordGraph">
            <svg id="coordinateGraph" viewBox="0 0 400 400" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">

                <line x1="200" y1="0" x2="200" y2="400" stroke="black"/>
                <line x1="0" y1="200" x2="400" y2="200" stroke="black"/>


                <line x1="50%" y1="0%" x2="48.75%" y2="1.25%" stroke="black"/>
                <line x1="50%" y1="0%" x2="51.25%" y2="1.25%" stroke="black"/>
                <line x1="100%" y1="50%" x2="98.75%" y2="48.75%" stroke="black"/>
                <line x1="100%" y1="50%" x2="98.75%" y2="51.25%" stroke="black"/>

                <line x1="16.5%" y1="50%" x2="16.5%" y2="51.25%" stroke="black"/>
                <line x1="33%" y1="50%" x2="33%" y2="51.25%" stroke="black"/>
                <line x1="66.5%" y1="50%" x2="66.5%" y2="51.25%" stroke="black"/>
                <line x1="83%" y1="50%" x2="83%" y2="51.25%" stroke="black"/>

                <line x1="50%" y1="16.5%" x2="48.75%" y2="16.5%" stroke="black"/>
                <line x1="50%" y1="33%" x2="48.75%" y2="33%" stroke="black"/>
                <line x1="50%" y1="66.5%" x2="48.75%" y2="66.5%" stroke="black"/>
                <line x1="50%" y1="83%" x2="48.75%" y2="83%" stroke="black"/>

                <text x="97%" y="47%" font-size="3%">X</text>
                <text x="51%" y="2%" font-size="3%">Y</text>

                <text x="56" y="190" font-size="14">-R</text>
                <text x="122" y="190" font-size="14">-R/2</text>
                <text x="256" y="190" font-size="14">R/2</text>
                <text x="327" y="190" font-size="14">R</text>

                <text x="210" y="66" font-size="14">R</text>
                <text x="210" y="132" font-size="14">R/2</text>
                <text x="210" y="266" font-size="14">-R/2</text>
                <text x="210" y="332" font-size="14">-R</text>


                <rect x="200" y="200" width="66" height="132" fill="skyblue" fill-opacity="0.3"/>

                <polygon points="66, 200 200,200 200,332" fill="skyblue" fill-opacity="0.3"/>

                <path d="M200,200 L266,200 A66,66 0 0,0 200,134 Z" fill="skyblue" fill-opacity="0.3"/>

                <g id="points-group"></g>
            </svg>
        </div>
    </div>
    <div class="rWindow">
        <form id="validationArgs">
            <label >Изменение X:</label>
            <div class="xButtons">
                <label><input type="button" name="x" data-value="-4" value="-4"></label>
                <label><input type="button" name="x" data-value="-3" value="-3"></label>
                <label><input type="button" name="x" data-value="-2" value="-2"></label>
                <label><input type="button" name="x" data-value="-1" value="-1"></label>
                <label><input type="button" name="x" data-value="0" value="0"></label>
                <label><input type="button" name="x" data-value="1" value="1"></label>
                <label><input type="button" name="x" data-value="2" value="2"></label>
                <label><input type="button" name="x" data-value="3" value="3"></label>
                <label><input type="button" name="x" data-value="4" value="4"></label>
            </div>

            <label >Изменение Y:</label>
            <label><input type="text" id="y" placeholder="{-5...3}" maxlength="10"></label>

            <label >Изменение R:</label>
            <label><input type="text" id="r" placeholder="{1...4}" maxlength="10"></label>
            <div class="ansButtons">
                <input type="submit" class="sumbitButton" value="Отправить">
                <input type="reset" class="resetButton" onclick="resetForm()" value="Сбросить">
            </div>
        </form>
    </div>
</div>
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
            List<Result> results = bean.getAll();
            if (!results.isEmpty()) {
                for (int i = 0; i < results.size(); i++) {
                    Result result = results.get(i);
                    String rowClass = result.isHit() ? "hit" : "miss";
    %>
    <tr class="<%= rowClass %>">
        <td><%= result.getX() %></td>
        <td><%= result.getY() %></td>
        <td><%= result.getR() %></td>
        <td><strong><%= result.isHit() ? "попал" : "мимо" %></strong></td>
        <td><%= result.getTimestamp() %></td>
        <td><%= String.format("%f", result.getExecutionTimeMs()) %></td>
    </tr>
    <% }
    } else {
    %>
    <tr>
        <td colspan="6" style="text-align: center;">Нет данных для отображения</td>
    </tr>
    <%
            }
        }
    %>
    </tbody>
</table>
<script src="${pageContext.request.contextPath}/static/js/Index.js" defer></script>
</body>
</html>
