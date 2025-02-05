import { useState } from "react";
import { auth, googleProvider } from "../../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInAnonymously, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function AuthPage() 
{
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isRegister, setIsRegister] = useState(false);
    const navigate = useNavigate();

    // 🔹 Обработчик входа и регистрации по email
    const handleAuth = async () => 
    {
        try 
        {
            if (isRegister) 
            {
                await createUserWithEmailAndPassword(auth, email, password);
            } 
            else 
            {
                await signInWithEmailAndPassword(auth, email, password);
            }
            navigate("/"); // После входа перекидываем на главную
        } 
        catch (error) 
        {
            console.error("Ошибка:", error.message);
        }
    };

    // 🔹 Вход через Google
    const handleGoogleSignIn = async () => 
    {
        try 
        {
            await signInWithPopup(auth, googleProvider);
            navigate("/"); 
        } 
        catch (error) 
        {
            console.error("Ошибка Google входа:", error.message);
        }
    };

    // 🔹 Анонимный вход
    const handleAnonymousSignIn = async () => 
    {
        try 
        {
            await signInAnonymously(auth);
            navigate("/");
        } 
        catch (error) 
        {
            console.error("Ошибка анонимного входа:", error.message);
        }
    };

    return (
        <div className="flex flex-col items-center p-4">
            <h2 className="text-xl mb-4">{isRegister ? "Регистрация" : "Вход"}</h2>
            
            {/* Поле Email */}
            <input 
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border p-2 mb-2 w-80"
            />

            {/* Поле Пароля */}
            <input 
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border p-2 mb-2 w-80"
            />

            {/* Кнопка Входа/Регистрации */}
            <button onClick={handleAuth} className="bg-blue-500 text-white p-2 w-80 mb-2">
                {isRegister ? "Зарегистрироваться" : "Войти"}
            </button>

            {/* Вход через Google */}
            <button onClick={handleGoogleSignIn} className="bg-red-500 text-white p-2 w-80 mb-2">
                Войти через Google
            </button>

            {/* Анонимный вход */}
            <button onClick={handleAnonymousSignIn} className="bg-gray-500 text-white p-2 w-80 mb-2">
                Войти как гость
            </button>

            {/* Переключение между Входом и Регистрацией */}
            <p onClick={() => setIsRegister(!isRegister)} className="text-blue-600 cursor-pointer">
                {isRegister ? "Уже есть аккаунт? Войти" : "Нет аккаунта? Зарегистрироваться"}
            </p>
        </div>
    );
}
