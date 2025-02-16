import { Link } from "react-router-dom";

export default function UniversityCard({ university, onRemove }) 
{
    return (
        <div className="border p-4 rounded-lg shadow-lg bg-white">
            <img src={university.image} alt={university.name} className="w-full h-40 object-cover rounded-md" />
            <h2 className="text-xl font-bold mt-2">{university.name}</h2>
            <p className="text-gray-600">{university.country}</p>
            <Link to={`/university/${university.id}`} className="text-blue-500 mt-2 inline-block">Подробнее</Link>
            <button onClick={onRemove} className="mt-2 bg-red-500 text-white px-3 py-1 rounded">Удалить</button>
        </div>
    );
}
