import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPoints, addPoint } from '../store/pointsSlice';
import { Slider } from 'primereact/slider';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Graph from '../Graph';
import { clearPoints } from '../store/pointsSlice';

function MainPage({ onLogout }) {
    const dispatch = useDispatch();
    const history = useSelector((state) => state.points.items);

    const [x, setX] = useState(0);
    const [y, setY] = useState("");
    const [r, setR] = useState(1);

    const username = localStorage.getItem('user');

    useEffect(() => {
        dispatch(fetchPoints());
    }, []);

    const handleSubmit = () => {
        const floatY = parseFloat(y.replace(',', '.'));
        if (isNaN(floatY) || floatY < -3 || floatY > 3) {
            alert("Y должен быть числом от -3 до 3!");
            return;
        }

        if (r <= 0) {
            alert("Радиус R должен быть больше 0 для проверки попадания!");
            return;
        }

        dispatch(addPoint({ x, y: floatY, r, owner: username}));
    };

    const handleChartClick = (x, y) => {
        const username = localStorage.getItem('user')
        dispatch(addPoint({ x, y, r, owner: username}));
    };

    const handleClear = () => {
        if(window.confirm("Точно удалить всё?")) {
            dispatch(clearPoints());
        }
    };

    return (
        <div className="p-4">
            <div className="grid">
                <div className="col-12 lg:col-8 flex justify-content-center align-items-start">
                    <div className="card shadow-2 p-3 border-round-xl bg-white w-full flex justify-content-center">
                        <Graph r={r} points={history} onChartClick={handleChartClick} />
                    </div>
                </div>

                <div className="col-12 lg:col-4">
                    <div className="card shadow-2 p-4 border-round-xl bg-white flex flex-column gap-4">

                        <div className="field">
                            <label className="block mb-2 font-bold text-900">Координата X: {x}</label>
                            <Slider value={x} onChange={(e) => setX(e.value)} min={-3} max={5} className="w-full" />
                        </div>

                        <div className="field">
                            <label htmlFor="y-input" className="block mb-2 font-bold text-900">Координата Y (-3...3):</label>
                            <InputText
                                id="y-input"
                                value={y}
                                onChange={(e) => setY(e.target.value)}
                                className="w-full"
                                placeholder="Введите число..."
                            />
                        </div>

                        <div className="field">
                            <label className="block mb-2 font-bold text-900">Радиус R: {r}</label>
                            <Slider value={r} onChange={(e) => setR(e.value)} min={-3} max={5} className="w-full" />
                            {r <= 0 && <small className="p-error block">R должен быть положительным!</small>}
                        </div>

                        <div className="flex flex-column gap-2 mt-2">
                            <Button label="Проверить" icon="pi pi-check" onClick={handleSubmit} className="w-full p-button-outlined" />
                            <Button label="Очистить историю" icon="pi pi-trash" onClick={() => dispatch(clearPoints())} className="w-full p-button-outlined p-button-danger" />
                            <Button label="Выйти" icon="pi pi-sign-out" onClick={onLogout} className="w-full p-button-secondary text-black p-button-outlined" />
                        </div>
                    </div>
                </div>

                <div className="col-12 mt-4">
                    <div className="card shadow-2 border-round-xl overflow-hidden">
                        <DataTable value={history} paginator rows={5} responsiveLayout="scroll" className="w-full">
                            <Column field="x" header="X"  />
                            <Column field="y" header="Y" />
                            <Column field="r" header="R" />
                            <Column field="executionTime"
                                    header="время выполнения ms"
                                    body={(d) => `${d.executionTime} ms`}
                            />
                            <Column
                                field="hit"
                                header="Результат"
                                body={(d) => d.hit ? <b className="text-green-500">Попал</b> : <b className="text-red-500">Мимо</b>}
                            />
                            <Column field="owner" header="Пользователь" />
                        </DataTable>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MainPage;