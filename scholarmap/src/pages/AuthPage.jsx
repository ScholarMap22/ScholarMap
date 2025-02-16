import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase"; 
import { 
    signInWithEmailAndPassword, 
    signInWithPopup, 
    GoogleAuthProvider, 
    signInAnonymously, 
    createUserWithEmailAndPassword 
} from "firebase/auth";

export default function AuthPage() 
{
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isRegister, setIsRegister] = useState(false); // Переключатель входа/регистрации
    const navigate = useNavigate();

    // Вход пользователя
    const handleLogin = async (e) => 
    {
        e.preventDefault();
        setError("");

        try 
        {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/");
        } 
        catch (err) 
        {
            setError("Ошибка входа. Проверьте данные.");
        }
    };

    // Регистрация пользователя
    const handleRegister = async (e) => 
    {
        e.preventDefault();
        setError("");

        try 
        {
            await createUserWithEmailAndPassword(auth, email, password);
            navigate("/");
        } 
        catch (err) 
        {
            setError("Ошибка регистрации. Возможно, email уже используется.");
        }
    };

    // Вход через Google
    const handleGoogleLogin = async () => 
    {
        const provider = new GoogleAuthProvider();

        try 
        {
            await signInWithPopup(auth, provider);
            navigate("/");
        } 
        catch (err) 
        {
            setError("Ошибка авторизации через Google.");
        }
    };

    // Анонимный вход
    const handleAnonymousLogin = async () => 
    {
        try 
        {
            await signInAnonymously(auth);
            navigate("/");
        } 
        catch (err) 
        {
            setError("Ошибка анонимного входа.");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                <h1 className="text-2xl font-bold mb-4">
                    {isRegister ? "Регистрация" : "Вход"}
                </h1>

                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                        ❌ {error}
                    </div>
                )}

                <form onSubmit={isRegister ? handleRegister : handleLogin} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 border rounded"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 border rounded"
                        required
                    />
                    <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded">
                        {isRegister ? "Зарегистрироваться" : "Войти"}
                    </button>
                </form>

                <div className="mt-4 space-y-2">
                    <button onClick={handleAnonymousLogin} className="w-full bg-gray-500 text-white p-3 rounded">
                        Войти анонимно
                    </button>

                    <button onClick={handleGoogleLogin} className="w-full bg-red-500 text-white p-3 rounded flex items-center justify-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
                            <path fill="#4285F4" d="M24 9.5c3.2 0 5.9 1.1 8 3.2l6-6C34.9 3.3 30 1 24 1 14.7 1 6.9 6.1 3 13.5l7.3 5.6C12.3 13.5 17.6 9.5 24 9.5z"/>
                            <path fill="#34A853" d="M46.1 24.5c0-1.6-.1-3.2-.4-4.7H24v9h12.8c-.6 3-2.3 5.5-4.9 7.2l7.3 5.6c4.3-4 6.9-9.9 6.9-16.1z"/>
                            <path fill="#FBBC05" d="M10.3 28.9c-1-3-1-6.2 0-9.2L3 13.5c-2.5 5-2.5 10.9 0 16l7.3-5.6z"/>
                            <path fill="#EA4335" d="M24 47c6 0 10.9-2 14.5-5.5l-7.3-5.6c-2 1.3-4.5 2-7.2 2-6.3 0-11.6-4-13.5-9.5l-7.3 5.6C6.9 41.9 14.7 47 24 47z"/>
                        </svg>
                        <span>Войти через Google</span>
                    </button>

                    <p 
                        className="mt-4 text-blue-500 cursor-pointer"
                        onClick={() => setIsRegister(!isRegister)}
                    >
                        {isRegister ? "Уже есть аккаунт? Войти" : "Нет аккаунта? Зарегистрироваться"}
                    </p>
                </div>
            </div>
        </div>
    );
}
