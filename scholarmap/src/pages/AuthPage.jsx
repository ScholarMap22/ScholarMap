import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    fetchSignInMethodsForEmail, 
    signInWithPopup, 
    GoogleAuthProvider, 
    signInAnonymously,
    onAuthStateChanged 
} from "firebase/auth";

export default function AuthPage() 
{
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => 
    {
        onAuthStateChanged(auth, (user) => 
        {
            if (user) 
            {
                if (user.email === "mailybaevadilet@gmail.com") 
                {
                    navigate("/admin");
                } 
                else if (user.isAnonymous) 
                {
                    navigate("/search");
                } 
                else 
                {
                    navigate("/profile");
                }
            }
        });
    }, [navigate]);

    const handleSubmit = async (e) => 
    {
        e.preventDefault();
        setError("");

        try 
        {
            if (isLogin) 
            {
                await signInWithEmailAndPassword(auth, email, password);
            } 
            else 
            {
                const methods = await fetchSignInMethodsForEmail(auth, email);
                if (methods.length > 0) 
                {
                    setError("Эта почта уже зарегистрирована.");
                    return;
                }
                await createUserWithEmailAndPassword(auth, email, password);
            }
        } 
        catch (err) 
        {
            setError(err.message);
        }
    };

    const handleGoogleSignIn = async () => 
    {
        try 
        {
            await signInWithPopup(auth, new GoogleAuthProvider());
        } 
        catch (err) 
        {
            setError(err.message);
        }
    };

    const handleAnonymousSignIn = async () => 
    {
        try 
        {
            await signInAnonymously(auth);
        } 
        catch (err) 
        {
            setError(err.message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <div className="bg-gray-500 p-8 rounded-xl shadow-lg w-96">
                <h2 className="text-2xl font-semibold mb-5 text-center">
                    {isLogin ? "Вход в аккаунт" : "Регистрация"}
                </h2>

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <button className="w-full bg-blue-600 text-white p-3 rounded-lg font-medium hover:bg-blue-700 transition">
                        {isLogin ? "Войти" : "Зарегистрироваться"}
                    </button>
                </form>

                <div className="mt-4 space-y-2">
                    <button 
                        className="w-full bg-red-500 text-white p-3 rounded-lg font-medium hover:bg-red-600 transition"
                        onClick={handleGoogleSignIn}
                    >
                        Войти через Google
                    </button>

                    <button 
                        className="w-full bg-gray-600 text-white p-3 rounded-lg font-medium hover:bg-gray-700 transition"
                        onClick={handleAnonymousSignIn}
                    >
                        Анонимный вход
                    </button>
                </div>

                <button 
                    className="mt-3 text-sm text-blue-600 w-full text-center"
                    onClick={() => setIsLogin(!isLogin)}
                >
                    {isLogin ? "Нет аккаунта? Зарегистрируйтесь" : "Уже есть аккаунт? Войти"}
                </button>
            </div>
        </div>
    );
}
