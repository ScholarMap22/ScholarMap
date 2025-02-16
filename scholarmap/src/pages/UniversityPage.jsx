import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

export default function UniversityPage({ toggleFavorite, favorites }) 
{
    const { id } = useParams();
    const [university, setUniversity] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => 
    {
        const fetchUniversity = async () => 
        {
            const docRef = doc(db, "universities", id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) 
            {
                setUniversity({ id: docSnap.id, ...docSnap.data() });
            }

            setLoading(false);
        };

        fetchUniversity();
    }, [id]);

    if (loading) return <div className="text-center py-20 text-lg">Загрузка...</div>;
    if (!university) return <div className="text-center py-20 text-lg">Университет не найден</div>;

    return (
        <div className="container mx-auto px-4 py-10">
            <img src={university.image} alt={university.name} className="w-full h-80 object-cover rounded-lg shadow-md" />
            
            <h1 className="text-4xl font-bold text-center mt-6">{university.name}</h1>

            <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between">
                <div className="text-lg text-gray-700">
                    <p><strong>Страна:</strong> {university.country}</p>
                    <p><strong>Факультеты:</strong> {university.faculty}</p>
                    <p><strong>Стоимость:</strong> {university.cost}</p>
                </div>
                
                <div className="flex items-center mt-4 md:mt-0">
                    {[...Array(10)].map((_, i) => (
                        <span key={i} className={i < university.rating ? "text-yellow-500 text-2xl" : "text-gray-300 text-2xl"}>★</span>
                    ))}
                </div>
            </div>

            <p className="mt-6 text-lg text-gray-800">{university.fullDescription}</p>

            <button 
                onClick={() => toggleFavorite(university)} 
                className={`mt-6 px-6 py-3 text-lg rounded-md shadow-md ${favorites.includes(university.id) ? "bg-gray-500 text-white" : "bg-green-500 text-white"}`}
            >
                {favorites.includes(university.id) ? "В избранном" : "Добавить в избранное"}
            </button>
        </div>
    );
}
