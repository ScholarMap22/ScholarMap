import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { db, auth } from "../../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { signOut } from "firebase/auth";

export default function HomePage()
{
    const [universities, setUniversities] = useState([]);
    const [search, setSearch] = useState("");
    const [filterOpen, setFilterOpen] = useState(false);
    const [filters, setFilters] = useState({ country: "", faculty: "" });
    const navigate = useNavigate();
    const user = auth.currentUser;
    const isAdmin = user?.email === "mailybaevadilet@gmail.com";

    useEffect(() =>
    {
        const fetchUniversities = async () =>
        {
            const querySnapshot = await getDocs(collection(db, "universities"));
            setUniversities(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };

        fetchUniversities();
    }, []);

    const handleDelete = async (id) =>
    {
        if (window.confirm("Удалить этот университет?"))
        {
            await deleteDoc(doc(db, "universities", id));
            setUniversities(universities.filter(u => u.id !== id));
        }
    };

    const filteredUniversities = universities.filter(u =>
        u?.name &&
        (!search || u.name.toLowerCase().includes(search.toLowerCase())) &&
        (!filters.country || u.country === filters.country) &&
        (!filters.faculty || u.faculty === filters.faculty)
    );

    return (
        <div>
            {/* HEADER */}
            <header className="w-full bg-gray-800 text-white p-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">Университеты</h1>
                <nav className="space-x-4">
                    <Link to="/" className="hover:underline">Главная</Link>
                    <Link to="/chatbot" className="hover:underline">Чат-бот</Link>
                    <Link to="/profile" className="hover:underline">Профиль</Link>
                    {isAdmin && <Link to="/admin" className="hover:underline">Админская панель</Link>}
                    <button onClick={() => signOut(auth)} className="ml-4 bg-red-500 px-3 py-1 rounded">Выйти</button>
                </nav>
            </header>

            {/* ПОИСК */}
            <div className="p-4 flex items-center gap-4">
                <input
                    type="text"
                    placeholder="Поиск университетов..."
                    onChange={(e) => setSearch(e.target.value)}
                    className="border p-2 w-full"
                />
                <button onClick={() => setFilterOpen(!filterOpen)} className="bg-gray-700 text-white px-4 py-2 rounded">Фильтр</button>
            </div>

            {/* ФИЛЬТРЫ */}
            {filterOpen && (
                <div className="p-4 bg-gray-500 border rounded">
                    <label className="block">Страна:
                        <input type="text" onChange={(e) => setFilters({ ...filters, country: e.target.value })} className="border p-2 w-full" />
                    </label>
                    <label className="block mt-2">Факультет:
                        <input type="text" onChange={(e) => setFilters({ ...filters, faculty: e.target.value })} className="border p-2 w-full" />
                    </label>
                </div>
            )}

            {/* СПИСОК УНИВЕРСИТЕТОВ */}
            <div className="grid grid-cols-3 gap-4 p-4">
                {filteredUniversities.length > 0 ? (
                    filteredUniversities.map(u => (
                        <div key={u.id} className="border p-4 rounded shadow">
                            <h2 className="text-xl font-bold">{u.name}</h2>
                            <p>{u.country}</p>
                            <button onClick={() => navigate(`/university/${u.id}`)} className="mt-2 bg-blue-500 text-white px-3 py-1 rounded">Подробнее</button>
                            {isAdmin && <button onClick={() => handleDelete(u.id)} className="ml-2 bg-red-500 text-white px-3 py-1 rounded">Удалить</button>}
                        </div>
                    ))
                ) : (
                    <p className="col-span-3 text-center">Университетов не найдено</p>
                )}
            </div>
        </div>
    );
}