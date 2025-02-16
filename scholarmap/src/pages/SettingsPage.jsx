import { useEffect, useState } from "react";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import { Link } from "react-router-dom";

// Импортируем переводы
import en from "../locales/en.json";
import ru from "../locales/ru.json";
import kz from "../locales/kz.json";

const translations = { en, ru, kz };

export default function SettingsPage() 
{
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
    const [language, setLanguage] = useState(localStorage.getItem("language") || "ru");
    const [emailNotifications, setEmailNotifications] = useState(localStorage.getItem("emailNotifications") === "true");
    const [pushNotifications, setPushNotifications] = useState(localStorage.getItem("pushNotifications") === "true");
    const [privacy, setPrivacy] = useState(localStorage.getItem("privacy") || "default");
    const [showPolicy, setShowPolicy] = useState(false); // Показывать модальное окно?

    const user = auth.currentUser;
    const t = translations[language]; // Выбираем переводы

    useEffect(() => 
    {
        document.documentElement.classList.toggle("dark", theme === "dark");
        localStorage.setItem("theme", theme);
    }, [theme]);

    const saveSettings = () => 
    {
        localStorage.setItem("language", language);
        localStorage.setItem("emailNotifications", emailNotifications);
        localStorage.setItem("pushNotifications", pushNotifications);
        localStorage.setItem("privacy", privacy);
        alert(t.save);
    };

    const deleteAccount = async () => 
    {
        if (window.confirm(t.deleteAccount)) 
        {
            await user.delete();
            window.location.href = "/";
        }
    };

    const logout = async () => 
    {
        await signOut(auth);
        window.location.href = "/";
    };

    return (
        <div className="container mx-auto px-4 py-24">
            <div className="max-w-lg mx-auto bg-white shadow-md p-6 rounded-lg dark:bg-gray-800 dark:text-white">
                <h1 className="text-2xl font-bold mb-4">{t.settings}</h1>

                {/* Переключение темы */}
                <div className="flex items-center justify-between mb-4">
                    <span>{t.theme}</span>
                    <button 
                        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                        className="px-4 py-2 rounded-md bg-blue-500 text-white"
                    >
                        {theme === "light" ? t.dark : t.light}
                    </button>
                </div>

                {/* Изменение языка */}
                <div className="flex items-center justify-between mb-4">
                    <span>{t.language}</span>
                    <select 
                        value={language} 
                        onChange={(e) => setLanguage(e.target.value)}
                        className="px-4 py-2 rounded-md border dark:bg-gray-700"
                    >
                        <option value="en">English</option>
                        <option value="ru">Русский</option>
                        <option value="kz">Қазақша</option>
                    </select>
                </div>

                {/* Настройки уведомлений */}
                <div className="mb-4">
                    <h2 className="text-lg font-semibold mb-2">{t.notifications}</h2>
                    <label className="flex items-center mb-2">
                        <input 
                            type="checkbox" 
                            checked={emailNotifications} 
                            onChange={() => setEmailNotifications(!emailNotifications)}
                            className="mr-2"
                        />
                        {t.email}
                    </label>
                    <label className="flex items-center">
                        <input 
                            type="checkbox" 
                            checked={pushNotifications} 
                            onChange={() => setPushNotifications(!pushNotifications)}
                            className="mr-2"
                        />
                        {t.push}
                    </label>
                </div>

                {/* Управление конфиденциальностью */}
                <div className="mb-4">
                    <h2 className="text-lg font-semibold mb-2">{t.privacy}</h2>
                    <select 
                        value={privacy} 
                        onChange={(e) => setPrivacy(e.target.value)}
                        className="px-4 py-2 rounded-md border dark:bg-gray-700"
                    >
                        <option value="default">{t.default}</option>
                        <option value="no-tracking">{t.noTracking}</option>
                    </select>
                </div>

                {/* Политика использования */}
                <button 
                    onClick={() => setShowPolicy(true)} 
                    className="w-full py-2 mb-2 bg-gray-500 text-white rounded-md"
                >
                    {t.policy.button}
                </button>

                {/* Модальное окно политики */}
                {showPolicy && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-lg w-full">
                            <h2 className="text-xl font-bold mb-4">{t.policy.title}</h2>
                            <p className="mb-4">{t.policy.text}</p>
                            <div className="flex justify-between">
                                <button 
                                    onClick={() => setShowPolicy(false)} 
                                    className="px-4 py-2 bg-red-500 text-white rounded-md"
                                >
                                    {t.policy.close}
                                </button>
                                <Link 
                                    to="/policy" 
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                                >
                                    {t.policy.more}
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                {/* Кнопки */}
                <button 
                    onClick={saveSettings} 
                    className="w-full py-2 mb-2 bg-green-500 text-white rounded-md"
                >
                    {t.save}
                </button>

                <button 
                    onClick={logout} 
                    className="w-full py-2 mb-2 bg-red-500 text-white rounded-md"
                >
                    {t.logout}
                </button>

                <button 
                    onClick={deleteAccount} 
                    className="w-full py-2 bg-gray-500 text-white rounded-md"
                >
                    {t.deleteAccount}
                </button>
            </div>
        </div>
    );
}
