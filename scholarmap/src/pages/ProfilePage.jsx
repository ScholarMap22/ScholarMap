import { auth } from "../../firebase";
import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";

export default function ProfilePage() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        auth.onAuthStateChanged((user) => setUser(user));
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            {user ? (
                <div className="bg-gray-500 p-6 rounded-lg shadow-md w-80">
                    <h2 className="text-xl font-semibold mb-4">Профиль</h2>
                    <p>Email: {user.email}</p>
                    <button className="mt-4 bg-red-500 text-white p-2 rounded" onClick={() => signOut(auth)}>
                        Выйти
                    </button>
                </div>
            ) : (
                <p>Пользователь не вошел в систему</p>
            )}
        </div>
    );
}
