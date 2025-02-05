export default function UniversityCard({ university }) 
{
    return (
        <div className="bg-white p-4 shadow-lg rounded-lg">
            <img src={university.image_url} alt={university.name} className="w-full h-40 object-cover rounded-md" />
            <h2 className="text-xl font-semibold mt-2">{university.name}</h2>
            <p className="text-gray-600">{university.country}</p>
        </div>
    );
}
