function checkPoint(x, y, r) {
    x = parseFloat(x); y = parseFloat(y); r = parseFloat(r);
    if (x <= 0 && y >= 0) return y <= (0.5 * x + 0.5 * r);
    if (x <= 0 && y <= 0) return x >= -r && y >= -r / 2.0;
    if (x >= 0 && y <= 0) return (x * x + y * y) <= (r * r);
    return false;
}

function drawGraph(r, points) {
    if (!points) points = window.globalPoints || [];
    window.globalPoints = points;

    const canvas = document.getElementById('graphCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const rInPixels = width / 3;
    const scale = rInPixels / r;

    const centerX = width / 2;
    const centerY = height / 2;

    ctx.fillStyle = '#409EFF';

    // Треугольник
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX - r * scale, centerY);
    ctx.lineTo(centerX, centerY - (r / 2) * scale);
    ctx.fill();

    // Прямоугольник
    ctx.beginPath();
    ctx.fillRect(centerX - r * scale, centerY, r * scale, (r / 2) * scale);

    // Сектор
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, r * scale, 0, Math.PI / 2, false);
    ctx.fill();

    // --- Оси ---
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, centerY); ctx.lineTo(width, centerY);
    ctx.moveTo(centerX, 0); ctx.lineTo(centerX, height);
    ctx.stroke();

    // --- Подписи ---
    ctx.fillStyle = "black";
    ctx.font = "12px Arial";

    // Подписи осей X
    ctx.fillText(r, centerX + r * scale - 5, centerY + 15);
    ctx.fillText(-r, centerX - r * scale - 5, centerY + 15);

    // Подписи осей Y
    ctx.fillText(r, centerX + 5, centerY - r * scale + 5);
    ctx.fillText(-r, centerX + 5, centerY + r * scale + 5);

    // --- Точки ---
    points.forEach(p => {
        const pX = centerX + p.x * scale;
        const pY = centerY - p.y * scale;

        const isHitNow = checkPoint(p.x, p.y, r);

        ctx.fillStyle = isHitNow ? '#00FF00' : '#FF0000';
        ctx.beginPath();
        ctx.arc(pX, pY, 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.stroke();
    });
}

function handleCanvasClick(event) {
    const rValStr = document.getElementById("checkForm:rInput").value;
    if (!rValStr) return;
    const currentR = parseFloat(rValStr.replace(',', '.'));

    const canvas = document.getElementById('graphCanvas');
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    const width = canvas.width;
    const height = canvas.height;

    const rInPixels = width / 3;
    const scale = rInPixels / currentR;

    const centerX = width / 2;
    const centerY = height / 2;

    const mathX = (clickX - centerX) / scale;
    const mathY = (centerY - clickY) / scale;

    document.getElementById('hiddenForm:xGraph').value = mathX.toFixed(2);
    document.getElementById('hiddenForm:yGraph').value = mathY.toFixed(2);
    document.getElementById('hiddenForm:rGraph').value = currentR;

    document.getElementById('hiddenForm:graphBtn').click();
}

function selectY(element, value) {
    const hiddenInput = document.getElementById('checkForm:yHidden');

    if (!hiddenInput) {
        console.error("Ошибка! Элемент 'checkForm:yHidden' не найден. Проверьте id формы в xhtml.");
        return;
    }

    hiddenInput.value = value;

    const buttons = document.querySelectorAll('.y-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        btn.style.backgroundColor = '#87CEFA';
        btn.style.color = 'white';
        btn.style.borderColor = 'white';
    });

    element.classList.add('active');
    element.style.backgroundColor = '#0056b3';
    element.style.borderColor = 'black';
}