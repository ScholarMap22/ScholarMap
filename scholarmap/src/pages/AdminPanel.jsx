import React, { useState } from 'react';
import { db, storage} from '../../firebase'; // Подключаем db и storage
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'; // Импортируем необходимые функции из Firebase

const AdminPanel = () => {
    const [name, setName] = useState('');
    const [country, setCountry] = useState('');
    const [faculties, setFaculties] = useState([]);  // Список выбранных факультетов
    const [otherFaculty, setOtherFaculty] = useState(''); // Для ввода нового факультета
    const [shortDescription, setShortDescription] = useState('');
    const [fullDescription, setFullDescription] = useState('');
    const [imageUrl, setImageUrl] = useState(''); // Ссылка на одно изображение
    const [fileName, setFileName] = useState(''); // Имя файла
    const [file, setFile] = useState(null); // Один выбранный файл
    const [uploadProgress, setUploadProgress] = useState(0); // Прогресс загрузки
    const [uploadStatus, setUploadStatus] = useState('waiting'); // Статус загрузки
    const [selectedCard, setSelectedCard] = useState('short'); // Выбор карточки ('short' или 'full')

    // Список стандартных факультетов для выбора
    const availableFaculties = [
        'Computer Science',
        'Engineering',
        'Medicine',
        'Business',
        'Law',
        'Arts',
        'Education',
    ];

    // Обработчик выбора файлов
    const handleImageUpload = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setFileName(selectedFile.name);

        const reader = new FileReader();
        reader.onloadend = () => {
            setImageUrl(reader.result); // Сохраняем превью
        };
        reader.readAsDataURL(selectedFile); // Читаем файл как DataURL для быстрого отображения превью

        // Загружаем файл
        handleFileUpload(selectedFile);
    };

    // Функция загрузки файла в Firebase Storage
    const handleFileUpload = (file) => {
        if (!file) return;

        setUploadStatus('in-progress'); // Изменяем статус на загрузку
        setUploadProgress(0); // Сбрасываем прогресс

        const storageRef = ref(storage, `/university_images/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                // Отслеживаем прогресс загрузки
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(progress);
            },
            (error) => {
                setUploadStatus('error'); // При ошибке меняем статус
                console.error("Error uploading file: ", error);
            },
            () => {
                // Когда файл загружен, получаем его URL
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    setImageUrl(url);
                    setUploadStatus('completed'); // Загрузка завершена
                });
            }
        );
    };

    // Обработчик изменения факультетов
    const handleFacultiesChange = (e) => {
        const { value, checked } = e.target;
        setFaculties((prevFaculties) => {
            if (checked) {
                return [...prevFaculties, value];
            } else {
                return prevFaculties.filter((faculty) => faculty !== value);
            }
        });
    };

    // Добавление нового факультета
    const handleAddFaculty = () => {
        if (otherFaculty && !faculties.includes(otherFaculty)) {
            setFaculties((prevFaculties) => [...prevFaculties, otherFaculty]);
            setOtherFaculty(''); // Очистить поле ввода
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Собираем данные для отправки
        const universityData = {
            name,
            country,
            faculties,
            shortDescription,
            fullDescription,
            image: imageUrl,  // Ссылка на изображение
        };
    
        try {
            // Добавляем университет в базу данных Firestore
            const docRef = await addDoc(collection(db, 'universities'), universityData);
            console.log('Document written with ID: ', docRef.id);
            alert('University added successfully!');
            // Сбрасываем форму после отправки
            setName('');
            setCountry('');
            setFaculties([]);
            setShortDescription('');
            setFullDescription('');
            setImageUrl('');
            setFile(null);
            setUploadProgress(0);
            setUploadStatus('waiting'); // Сбрасываем статус
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    // Обработчик для переключения между карточками
    const toggleCard = (cardType) => {
        setSelectedCard(cardType);
    };

    return (
        <div className="container mx-auto p-5">
            <h2 className="text-2xl font-bold">Add University</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="University Name" 
                    className="p-2 w-full border" 
                    required
                />
                <input 
                    type="text" 
                    value={country} 
                    onChange={(e) => setCountry(e.target.value)} 
                    placeholder="Country" 
                    className="p-2 w-full border" 
                    required
                />
                
                {/* Выбор факультетов */}
                <div>
                    <label className="block mb-2 font-semibold">Select Faculties</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {availableFaculties.map((faculty) => (
                        <div key={faculty} className="flex items-center">
                            <input 
                                type="checkbox" 
                                id={faculty}
                                value={faculty} 
                                checked={faculties.includes(faculty)} 
                                onChange={handleFacultiesChange} 
                                className="hidden"
                            />
                            <label 
                                htmlFor={faculty} 
                                className={`cursor-pointer block py-3 px-6 rounded-md text-center border transition-all duration-200 
                                    ${faculties.includes(faculty) 
                                    ? 'bg-blue-500 text-white border-blue-500' 
                                    : 'bg-white text-black border-gray-400'}
                                `}
                                style={{ width: '100%', height: '60px' }}
                                >
                                {faculty}
                            </label>
                        </div>
                        ))}
                    </div>
                    {/* Поле для ввода собственного факультета */}
                    <div className="mt-2">
                        <input
                            type="text"
                            value={otherFaculty}
                            onChange={(e) => setOtherFaculty(e.target.value)}
                            placeholder="Enter your own faculty"
                            className="p-2 w-full border"
                        />
                        <button
                            type="button"
                            onClick={handleAddFaculty}
                            className="mt-2 p-2 bg-green-500 text-white rounded"
                        >
                            Add Custom Faculty
                        </button>
                    </div>
                </div>

                {/* Описание */}
                <textarea 
                    value={shortDescription} 
                    onChange={(e) => setShortDescription(e.target.value)} 
                    placeholder="Short Description" 
                    className="p-2 w-full border" 
                    required
                />
                <textarea 
                    value={fullDescription} 
                    onChange={(e) => setFullDescription(e.target.value)} 
                    placeholder="Full Description" 
                    className="p-2 w-full border" 
                    required
                />

                {/* Выбор файла */}
                <div className="mb-4">
                    <label 
                        htmlFor="file-input"
                        className="block text-center py-2 px-4 bg-blue-500 text-white cursor-pointer rounded mb-2"
                    >
                        {file ? 'Файл выбран: ' + fileName : 'Выбрать файл'}
                    </label>
                    <input 
                        type="file" 
                        id="file-input" 
                        onChange={handleImageUpload} 
                        className="hidden" 
                    />
                </div>

                {/* Прогресс загрузки */}
                {uploadProgress > 0 && (
                    <div className="w-full">
                        <label className="text-sm">{fileName}</label>
                        <progress 
                            value={uploadProgress} 
                            max="100" 
                            className="w-full h-2 bg-blue-200 rounded"
                        ></progress>
                        <div className="text-right text-xs">{Math.round(uploadProgress)}%</div>
                    </div>
                )}

                {/* Статус загрузки */}
                {uploadStatus === 'completed' && (
                    <div className="text-green-500 text-sm">Загрузка завершена!</div>
                )}

                <button type="submit" className="p-2 bg-blue-500 text-white rounded">
                    Добавить университет
                </button>
            </form>

            {/* Кнопки переключения карточек */}
            <div className="mt-6 flex justify-center gap-4">
                <button
                    onClick={() => toggleCard('short')}
                    className={`px-4 py-2 rounded ${selectedCard === 'short' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    Краткое описание
                </button>
                <button
                    onClick={() => toggleCard('full')}
                    className={`px-4 py-2 rounded ${selectedCard === 'full' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    Полное описание
                </button>
            </div>

            {/* Карточка с мини-обзором */}
            <div className={`transition-all duration-500 ease-in-out ${selectedCard === 'short' ? 'opacity-100 w-[500px]' : 'opacity-0 absolute'}`}>
                    <div className="border p-4 rounded shadow mt-4">
                        {imageUrl ? (
                            <img 
                                src={imageUrl} 
                                alt="University Image" 
                                className="w-full object-cover rounded"
                            />
                        ) : (
                            <div className="text-center text-gray-500">
                                Картинка не загрузилась
                            </div>
                        )}
                        <h3 className="text-lg font-bold mt-2">{name}</h3>
                        <p>{country}</p>
                        <p>{faculties.join(', ')}</p>
                        <p>{shortDescription}</p>
                    </div>
                </div>

                {/* Карточка с полным обзором */}
                <div className={`transition-all duration-500 ease-in-out ${selectedCard === 'full' ? 'opacity-100 w-[1300px]' : 'opacity-0 absolute'}`}>
                    <div className="border p-4 rounded shadow mt-4">
                        {imageUrl ? (
                            <img 
                                src={imageUrl} 
                                alt="University Image" 
                                className="w-fullobject-cover rounded"
                            />
                        ) : (
                            <div className="text-center text-gray-500">
                                Картинка не загрузилась
                            </div>
                        )}
                        <h3 className="text-lg font-bold mt-2">{name}</h3>
                        <p>{country}</p>
                        <p>{faculties.join(', ')}</p>
                        <p>{fullDescription}</p>
                    </div>
                </div>

                <button 
                    type="submit" 
                    className="mt-4 p-2 bg-blue-500 text-white rounded"
                >
                    Добавить университет
                </button>
        </div>
    );
};

export default AdminPanel;
