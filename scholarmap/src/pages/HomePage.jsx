import React, { useState, useEffect } from "react";
import { Link , useNavigate} from "react-router-dom";
import { auth, db } from "../../firebase";
import { doc, deleteDoc } from "firebase/firestore";

export default function HomePage({ search, setSearch, universities = [], toggleFavorite, favorites = [] }) 
{
    const [filter, setFilter] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedFaculty, setSelectedFaculty] = useState("");
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => 
    {
        const unsubscribe = auth.onAuthStateChanged(setUser);
        return () => unsubscribe();
    }, []);

    const isAdmin = user?.email === "mailybaevadilet@gmail.com";

    const filteredUniversities = universities.filter(u =>
        u?.name?.toLowerCase().includes(search?.toLowerCase() || "") &&
        (selectedCountry ? u?.country?.toLowerCase().includes(selectedCountry.toLowerCase()) : true) &&
        (selectedFaculty ? u?.faculty?.toLowerCase().includes(selectedFaculty.toLowerCase()) : true)
    );

    const handleDelete = async (id) => 
    {
        if (window.confirm("Вы уверены, что хотите удалить этот университет?")) 
        {
            await deleteDoc(doc(db, "universities", id));
        }
    };

    return (
        <div className="container mx-auto px-4 py-24">
            <div className="flex flex-col items-center w-full">
                {/* Поисковая строка */}
                <input
                    type="text"
                    placeholder="Поиск университетов..."
                    value={search || ""}
                    onChange={(e) => setSearch?.(e.target.value)}
                    className="border p-3 w-full max-w-lg rounded-md text-lg"
                />

                {/* Кнопка фильтра */}
                <button 
                    className="mt-4 bg-gray-200 px-6 py-2 rounded text-lg" 
                    onClick={() => setFilter(!filter)}
                >
                    Фильтр
                </button>

                {/* Фильтр по стране и факультету */}
                {filter && (
                    <div className="mt-4 p-4 border rounded w-full max-w-lg bg-gray-20 shadow-md">
                        <label className="block text-lg">Страна
                            <input 
                                type="text" 
                                value={selectedCountry} 
                                onChange={(e) => setSelectedCountry(e.target.value)} 
                                className="border p-3 w-full rounded-md" 
                            />
                        </label>
                        <label className="block mt-4 text-lg">Факультет
                            <input 
                                type="text" 
                                value={selectedFaculty} 
                                onChange={(e) => setSelectedFaculty(e.target.value)} 
                                className="border p-3 w-full rounded-md" 
                            />
                        </label>
                    </div>
                )}
            </div>

            {/* Список университетов */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {filteredUniversities.length > 0 ? (
                    filteredUniversities.map(u => (
                        <div key={u?.id} className="border p-6 rounded-lg shadow-lg bg-white relative">
                            {/* Изображение университета */}
                            {u?.image && (
                                <img src={u.image} alt={u?.name || "Университет"} className="w-full h-40 object-cover rounded-md" />
                            )}

                            {/* Название и страна */}
                            <h2 className="text-xl font-bold mt-2">{u?.name || "Неизвестный университет"}</h2>
                            <p className="text-gray-600">{u?.country || "Неизвестная страна"}</p>
                            <p className="text-gray-700">{u?.shortDescription || "Нет краткого описания"}</p>

                            {/* Рейтинг в виде звезд */}
                            <div className="flex items-center mt-2">
                                {[...Array(10)].map((_, i) => (
                                    <span key={i} className={i < (u?.rating || 0) ? "text-yellow-500" : "text-gray-300"}>★</span>
                                ))}
                            </div>

                            {/* Кнопки */}
                            <div className="mt-3 flex justify-between">
                            <button onClick={() => navigate(`/university/${u.id}`)}>
                                Подробнее
                            </button>
                            <button onClick={() => toggleFavorite(u)}>
                                {favorites.some(fav => fav.id === u.id) ? "Убрать из избранного" : "Добавить в избранное"}
                            </button>
                            </div>

                            {/* Кнопка удаления (только для админа) */}
                            {isAdmin && (
                                <button
                                    onClick={() => handleDelete(u?.id)}
                                    className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
                                >
                                    Удалить
                                </button>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">Университеты не найдены</p>
                )}
            </div>

            {/* Кнопка для админов */}
            {isAdmin && (
                <Link to="/admin" className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg">
                    Админская панель
                </Link>
            )}
        </div>
    );
}
