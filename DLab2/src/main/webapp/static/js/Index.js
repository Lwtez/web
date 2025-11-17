let selectedX = null;
let currentR = null;

document.addEventListener('DOMContentLoaded', () => {
    const svg = document.getElementById('coordinateGraph');
    const pointsGroup = document.getElementById('points-group');
    const rInput = document.getElementById('r');

    initXButtons();

    document.getElementById('validationArgs').addEventListener('submit', e => {
        e.preventDefault();
        const yInput = document.getElementById('y');

        if (validate(selectedX, yInput, rInput)) {
            send(selectedX, yInput.value, rInput.value, false);
        }
    });

    svg.addEventListener('click', function(event) {
        const rValue = parseFloat(rInput.value);
        if (isNaN(rValue) || rValue < 1 || rValue > 4) {
            alert('Введите корректное значение R от 1 до 4');
            return;
        }
        currentR = rValue;

        const rect = svg.getBoundingClientRect();
        const svgX = event.clientX - rect.left;
        const svgY = event.clientY - rect.top;

        const mathCoords = svgToMath(svgX, svgY, svg);
        drawPointByMath(mathCoords.x, mathCoords.y, currentR, pointsGroup);

        send(mathCoords.x, mathCoords.y, currentR, true);
    });

    rInput.addEventListener('input', () => {
        const newR = parseFloat(rInput.value);
        if (!isNaN(newR) && newR >= 1 && newR <= 4) {
            currentR = newR;
            redrawAllPoints(newR, pointsGroup);
        }
    });
    rInput.addEventListener('change', () => {
        const newR = parseFloat(rInput.value);
        if (!isNaN(newR) && newR >= 1 && newR <= 4) {
            currentR = newR;
            redrawAllPoints(newR, pointsGroup);
        }
    });
});

function initXButtons() {
    document.querySelectorAll(".xButtons input[name='x']").forEach(btn => {
        btn.addEventListener("click", function () {
            document.querySelectorAll(".xButtons input[name='x']").forEach(b => b.classList.remove("active"));
            this.classList.add("active");
            selectedX = this.dataset.value;
        });
    });
}

function validate(x, yInput, rInput) {
    if (x === null) { showError(document.querySelector(".xButtons"), "Выберите X"); return false; }

    if (!yInput.value || !/^-?\d+(\.\d+)?$/.test(yInput.value) || yInput.value < -5 || yInput.value > 3) {
        showError(yInput, "Введите значение Y от -5 до 3"); return false; }

    if (!rInput.value || !/^-?\d+(\.\d+)?$/.test(rInput.value) || rInput.value < 1 || rInput.value > 4) {
        showError(rInput, "Введите значение R от 1 до 4"); return false; }

    return true;
}


function send(x, y, r, fromGraph = false) {
    const url = `controller?x=${encodeURIComponent(x)}&y=${encodeURIComponent(y)}&r=${encodeURIComponent(r)}`;
    fetch(url, { method: 'GET' })
        .then(resp => {
            if (!resp.ok) throw new Error('Network response was not ok: ' + resp.status);
            return resp.text();
        })
        .then(html => {
            if (!fromGraph){
                document.documentElement.innerHTML = html;
            } else {
                updateResultsTable(html);
            }
        })
        .catch(err => {
            console.error("Ошибка запроса:", err);
            alert("Произошла ошибка: " + err.message);
        });
}


function updateResultsTable(html) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    const newTable = tempDiv.querySelector('#resultTable');
    if (!newTable) {
        console.warn('#resultTable не найден');
        return;
    }

    const newTbody = newTable.querySelector('tbody');
    if (!newTbody || !newTbody.lastElementChild) {
        console.warn('строки отсутствуют');
        return;
    }

    const latestRow = newTbody.lastElementChild.cloneNode(true);

    const currentTbody = document.querySelector('#resultTable tbody');
    if (currentTbody) {
        currentTbody.insertBefore(latestRow, currentTbody.firstElementChild);
    } else {
        console.warn('таблица не найдена');
    }
}


function getAllPointsFromTable() {
    const rows = document.querySelectorAll("#resultTable tbody tr");
    const points = [];

    rows.forEach(row => {
        const cells = row.querySelectorAll("td");
        if (cells.length < 3) return;
        if (cells[0].hasAttribute('colspan')) return;

        const rawX = cells[0].textContent;
        const rawY = cells[1].textContent;
        const rawR = cells[2].textContent;

        const x = parseFloat(rawX);
        const y = parseFloat(rawY);
        const r = parseFloat(rawR);

        if (isNaN(x) || isNaN(y) || isNaN(r)) return;
        points.push({ x, y, r });
    });

    return points;
}

function mathToSvg(x, y, r, svg) {
    const rect = svg.getBoundingClientRect();
    const W = rect.width;
    const H = rect.height;
    const centerX = W/2;
    const centerY = H/2;

    const pxDot = (H/2) * 0.66 / r;

    const svgX = centerX + x * pxDot;
    const svgY = centerY - y * pxDot;

    return { svgX, svgY };
}

function redrawAllPoints(newR, pointsGroup) {
    pointsGroup.innerHTML = '';

    const svg = document.getElementById('coordinateGraph');
    if (!svg) return;

    const points = getAllPointsFromTable();

    points.forEach(p => {
        const coords = mathToSvg(p.x, p.y, newR, svg);
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', coords.svgX);
        circle.setAttribute('cy', coords.svgY);
        circle.setAttribute('r', 4);
        circle.setAttribute('fill',  'green');
        pointsGroup.appendChild(circle);
    });
}

function svgToMath(svgX, svgY, svg) {
    const rect = svg.getBoundingClientRect();
    const W = rect.width;
    const H = rect.height;
    const centerX = W/2;
    const centerY = H/2;
    const r = currentR || 1;
    const pxDot = (H/2) * 0.66 / r;
    const mathX = (svgX - centerX) / pxDot;
    const mathY = (centerY - svgY) / pxDot;
    return { x: parseFloat(mathX.toFixed(2)), y: parseFloat(mathY.toFixed(2)) };
}

function drawPointByMath(x, y, r, pointsGroup) {
    const svg = document.getElementById('coordinateGraph');
    const coords = mathToSvg(x, y, r, svg);
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', coords.svgX);
    circle.setAttribute('cy', coords.svgY);
    circle.setAttribute('r', 4);
    circle.setAttribute('fill', 'red');
    pointsGroup.appendChild(circle);
}


function showError(element, msg) {
    const existing = element.parentNode.querySelector('.error-message');
    if (existing) existing.remove();

    const errEl = document.createElement('div');
    errEl.className = 'error-message';
    errEl.textContent = msg;
    errEl.style.color = 'red';
    errEl.style.fontSize = '13px';
    errEl.style.textAlign = 'center';
    element.parentNode.insertBefore(errEl, element.nextSibling);
    setTimeout(() => errEl.remove(), 3000);
}

function resetForm() {
    document.getElementById("validationArgs").reset();
    selectedX = null;
    document.querySelectorAll(".xButtons input[name='x']").forEach(b => b.classList.remove("active"));
}
