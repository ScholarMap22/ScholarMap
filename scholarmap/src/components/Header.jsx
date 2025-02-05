import { Link } from "react-router-dom";
import { auth } from "../../firebase";
import { useAuth } from "../hooks/useAuth";

export default function Header() 
{
    const { user, role } = useAuth();

    return (
        <header className="bg-gray-800 text-white p-4 flex justify-between">
            <Link to="/" className="text-lg font-bold">Университеты</Link>

            <div className="flex gap-4">
                {role === "admin" && <Link to="/admin" className="bg-red-500 px-4 py-2 rounded">Админская панель</Link>}
                {user ? (
                    <button onClick={() => auth.signOut()} className="bg-gray-500 px-4 py-2 rounded">Выйти</button>
                ) : (
                    <Link to="/auth" className="bg-blue-500 px-4 py-2 rounded">Войти</Link>
                )}
            </div>
        </header>
    );
}
