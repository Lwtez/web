let selectedX = null;

function initXButtons() {
    document.querySelectorAll(".xButtons input[name='x']").forEach(btn => {
        btn.addEventListener("click", function () {
            document.querySelectorAll(".xButtons input[name='x']").forEach(b => b.classList.remove("active"));
            this.classList.add("active");
            selectedX = this.dataset.value;
        });
    });
}

function validate(x, yInput, rCheckboxes) {
    const rSelected = Array.from(rCheckboxes).filter(ch => ch.checked).map(ch => ch.value);

    if (x === null) { showError(document.querySelector(".xButtons"), "Выберите X"); return false; }
    if (!yInput.value || !/^-?\d+(\.\d+)?$/.test(yInput.value) || yInput.value < -3 || yInput.value > 3) {
        showError(yInput, "Введите значение Y от -3 до 3"); return false;
    }
    if (rSelected.length === 0) { showError(document.getElementById("rLabel"), "Выберите хотя бы один R"); return false; }

    return true;
}

function send(x, y, rSelected) {
    const formData = `x=${encodeURIComponent(x)}&y=${encodeURIComponent(y)}&r=${encodeURIComponent(rSelected.join(','))}`;
//http://localhost:24034/fcgi-bin/app.jar
    fetch('/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData
    })
        .then(resp => resp.text())
        .then(text => {
            const lines = text.trim().split('\n');

            lines.forEach(line => {
                if (!line || line.startsWith('error=')) return;

                const obj = {};
                line.split(';').forEach(pair => {
                    const [key, val] = pair.split('=');
                    obj[key] = val;
                });

                if (obj.x && obj.y && obj.r && obj.result !== undefined) {
                    saveResponseToLocalStorage(obj);
                    showResponse(obj);
                }
            });
        })
        .catch(err => console.error("Ошибка запроса:", err));
}



function getResponsesFromLocalStorage() {
    return JSON.parse(localStorage.getItem("data") || '[]');
}

function saveResponseToLocalStorage(resp) {
    let responses = getResponsesFromLocalStorage();
    responses.push(resp);
    localStorage.setItem("data", JSON.stringify(responses));
}

function showResponse(resp) {
    const tableBody = document.getElementById('resultTable');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${resp.x}</td>
        <td>${resp.y}</td>
        <td>${resp.r}</td>
        <td>${resp.result === 'true' ? 'точное попадание' : 'мимо'}</td>
        <td>${resp.time}</td>
        <td>${resp.exec} ms</td>
    `;
    tableBody.appendChild(row);
}


function showError(element, msg) {
    const errEl = document.createElement('div');
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

document.addEventListener('DOMContentLoaded', () => {
    initXButtons();

    getResponsesFromLocalStorage()
        .filter(resp => resp.x !== undefined && resp.y !== undefined && resp.r !== undefined)
        .forEach(showResponse);


    document.getElementById('validationArgs').addEventListener('submit', e => {
        e.preventDefault();
        const yInput = document.getElementById('y');
        const rCheckboxes = document.querySelectorAll('input[name="r"]');
        const rSelected = Array.from(rCheckboxes).filter(ch => ch.checked).map(ch => ch.value);

        if (validate(selectedX, yInput, rCheckboxes)) {
            send(selectedX, yInput.value, rSelected);
        }
    });
});
