import React from "react";
import { Link } from "react-router-dom";

export default function Header({ user, logout }) 
{
    return (
        <header className="bg-blue-600 text-white py-4 shadow-md w-full fixed top-0 left-0 right-0 z-50">
            <div className="container mx-auto flex justify-between items-center px-4">
                <Link to="/" className="text-xl font-bold">ScholarMap</Link>
                <nav className="flex space-x-4">
                    <Link to="/" className="hover:underline">Главная</Link>
                    <Link to="/chatbot" className="hover:underline">Чат-бот</Link>
                    <Link to="/profile" className="hover:underline">Профиль</Link>
                    <Link to="/settings" className="hover:underline">Настройки</Link>
                    {user?.isAdmin && <Link to="/admin" className="hover:underline">Админка</Link>}
                    {user ? (
                        <button onClick={logout} className="bg-red-500 px-3 py-1 rounded">Выйти</button>
                    ) : (
                        <Link to="/auth" className="bg-green-500 px-3 py-1 rounded">Войти</Link>
                    )}
                </nav>
            </div>
        </header>
    );
}

