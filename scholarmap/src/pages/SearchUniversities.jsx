import { useState, useEffect } from "react";
import { db } from "../../firebase"; // Импортируем подключение к Firebase
import { collection, getDocs, query } from "firebase/firestore"; // Импортируем методы Firestore

export default function SearchUniversities() {
    const [universities, setUniversities] = useState([]); // Состояние для хранения университетов
    const [search, setSearch] = useState(""); // Состояние для поискового запроса
    const [filteredUniversities, setFilteredUniversities] = useState([]); // Состояние для фильтрованных университетов
    const [loading, setLoading] = useState(true); // Состояние для загрузки
    const [searched, setSearched] = useState(false); // Состояние для проверки поиска

    useEffect(() => {
        // Функция для получения университетов из Firebase
        const fetchUniversities = async () => {
            try {
                setLoading(true); // Включаем индикатор загрузки
                const q = query(collection(db, "universities")); // Запрос к коллекции "universities"
                const querySnapshot = await getDocs(q); // Получаем данные из Firestore
                setUniversities(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))); // Сохраняем данные
            } catch (error) {
                console.error("Ошибка при получении данных: ", error); // Логируем ошибку, если она есть
            } finally {
                setLoading(false); // Выключаем индикатор загрузки
            }
        };

        fetchUniversities(); // Вызываем функцию загрузки университетов
    }, []);

    const handleSearch = () => {
        setSearched(true); // Устанавливаем состояние поиска в true
        const result = universities.filter(u =>
            u.name && u.name.toLowerCase().includes(search.toLowerCase()) // Проверяем, что name существует
        );
        setFilteredUniversities(result); // Сохраняем результат фильтрации
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-6 px-4">
            <h1 className="text-3xl font-semibold mb-4">Поиск университетов</h1>
            <div className="w-full max-w-md bg-gray-500 p-6 rounded-lg shadow-md">
                <input
                    type="text"
                    placeholder="Поиск университетов..."
                    onChange={(e) => setSearch(e.target.value)} // Обновляем состояние поиска
                    value={search}
                    className="w-full border p-2 rounded-md mb-4"
                />
                <button
                    onClick={handleSearch} // Запускаем поиск по нажатию
                    className="bg-blue-500 text-white py-2 px-4 rounded-md mb-4"
                >
                    Искать
                </button>

                {loading ? (
                    <p>Загрузка...</p> // Показать, если данные загружаются
                ) : (
                    <>
                        {searched && filteredUniversities.length === 0 ? (
                            <p>Университеты не найдены.</p> // Если университеты не найдены
                        ) : (
                            <ul className="space-y-2">
                                {filteredUniversities.length > 0 ? (
                                    filteredUniversities.map(u => (
                                        <li key={u.id} className="border-b py-2">
                                            <h3 className="font-semibold">{u.name}</h3>
                                            <p>{u.country}</p>
                                        </li>
                                    ))
                                ) : (
                                    universities.map(u => (
                                        <li key={u.id} className="border-b py-2">
                                            <h3 className="font-semibold">{u.name}</h3>
                                            <p>{u.country}</p>
                                        </li>
                                    ))
                                )}
                            </ul>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
