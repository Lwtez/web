import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import axios from 'axios';
import {Message} from "primereact/message";
axios.defaults.withCredentials = true;

const LoginPage = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLoginClick = async () => {
        try {
            const response = await axios.post('/backend-1.0-SNAPSHOT/api/auth/login', {
                login: username,
                password: password
            });
            if (response.status === 200) {
                onLogin(username);
            }
        } catch (error) {
            alert("Неверный логин или пароль! Если вы не зарегистрированы — нажмите Регистрация.");
        }
    };

    const handleRegisterClick = async () => {
        try {
            await axios.post('/backend-1.0-SNAPSHOT/api/auth/register', {
                login: username,
                password: password
            });
            alert("Пользователь создан! Теперь можно войти.");
        } catch (error) {
            alert("Ошибка регистрации: возможно, логин занят.");
        }
    };

    const validate = () => {
        if (!username.trim() || !password.trim()) {
            setError("Заполните все поля!");
            return false;
        }
        return true;
    };

    return (
        <div className="flex flex-column align-items-center justify-content-center" style={{ minHeight: '100vh' }}>

            <div className="card shadow-2 mb-4 p-4 w-full md:w-30rem text-center bg-white text-black border-round-xl">
                <h2 className="m-0">Дорош Даниил Денисович</h2>
                <p className="mt-2 mb-0">Группа: P3222 | Вариант: 74931</p>
            </div>

            <div className="card shadow-4 p-5 w-full md:w-30rem bg-white border-round-xl">
                <h3 className="text-center mb-4 text-900">Авторизация</h3>

                {error && <Message severity="error" text={error} className="w-full mb-4" />}

                <div className="p-fluid">
                    <div className="field mb-4">
                        <label htmlFor="username" className="font-bold block mb-2">Логин</label>
                            <InputText
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Введите логин"
                            />
                    </div>

                    <div className="field mb-4">
                        <label htmlFor="password" className="font-bold block mb-2">Пароль</label>
                        <Password
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            feedback={false}
                            toggleMask
                            placeholder="Введите пароль"
                        />
                    </div>

                    <div className="flex flex-column gap-2 mt-2">
                        <Button label="Войти" icon="pi pi-sign-in" onClick={handleLoginClick} className="p-button-outlined" />
                        <Button label="Зарегистрироваться" icon="pi pi-user-plus" onClick={handleRegisterClick} className="p-button-outlined p-button-secondary" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;