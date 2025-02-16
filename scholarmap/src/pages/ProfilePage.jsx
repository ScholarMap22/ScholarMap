import { useState, useEffect } from "react";
import { auth, db, storage } from "../../firebase"; // Firebase SDK
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import UniversityCard from "../components/UniversityCard";
import { useTranslation } from "react-i18next";

export default function ProfilePage() 
{
    const { t } = useTranslation();
    const [user, setUser] = useState(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [avatar, setAvatar] = useState("/default-avatar.png");
    const [favorites, setFavorites] = useState([]);
    const [universities, setUniversities] = useState([]);

    useEffect(() => 
    {
        const fetchUserData = async () => 
        {
            const user = auth.currentUser;
            if (user) 
            {
                setUser(user);
                setEmail(user.email);

                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) 
                {
                    const userData = userDoc.data();
                    setName(userData.name || "");
                    setAvatar(userData.avatar || "/default-avatar.png");
                    setFavorites(userData.favorites || []);
                }
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => 
    {
        const fetchFavorites = async () => 
        {
            if (favorites.length === 0) 
            {
                setUniversities([]);
                return;
            }

            const universityData = await Promise.all(
                favorites.map(async (id) => 
                {
                    const docRef = doc(db, "universities", id);
                    const docSnap = await getDoc(docRef);
                    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
                })
            );

            setUniversities(universityData.filter(Boolean)); // Фильтруем пустые значения
        };

        fetchFavorites();
    }, [favorites]);

    const handleSaveProfile = async () => 
    {
        if (user) 
        {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, { name, avatar });
        }
    };

    const handleUploadAvatar = async (e) => 
    {
        const file = e.target.files[0];
        if (file) 
        {
            const storageRef = ref(storage, `avatars/${user.uid}`);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            setAvatar(url);
            await updateDoc(doc(db, "users", user.uid), { avatar: url });
        }
    };

    const handleRemoveFavorite = async (id) => 
    {
        const newFavorites = favorites.filter((favId) => favId !== id);
        setFavorites(newFavorites);

        if (user) 
        {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, { favorites: newFavorites });
        }
    };

    const handleLogout = async () => 
    {
        await signOut(auth);
        window.location.reload();
    };

    return (
        <div className="max-w-3xl mx-auto py-16 px-4">
            <h1 className="text-3xl font-bold mb-6">{t("profile.title")}</h1>

            <div className="flex items-center space-x-4">
                <img src={avatar} alt="Avatar" className="w-24 h-24 rounded-full border" />
                <input type="file" accept="image/*" onChange={handleUploadAvatar} className="hidden" id="upload-avatar" />
                <label htmlFor="upload-avatar" className="cursor-pointer bg-blue-500 text-white px-3 py-1 rounded">
                    {t("profile.uploadPhoto")}
                </label>
            </div>

            <div className="mt-4">
                <label className="block text-lg">{t("profile.name")}</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="border p-2 w-full rounded" />
            </div>

            <div className="mt-4">
                <label className="block text-lg">Email</label>
                <input type="text" value={email} disabled className="border p-2 w-full bg-gray-100 rounded" />
            </div>

            <button onClick={handleSaveProfile} className="mt-4 bg-green-500 text-white px-4 py-2 rounded">
                {t("profile.save")}
            </button>
            <button onClick={handleLogout} className="mt-4 bg-red-500 text-white px-4 py-2 rounded ml-4">
                {t("profile.logout")}
            </button>

            <h2 className="text-2xl font-bold mt-8">{t("profile.favorites")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {universities.length > 0 ? (
                    universities.map((uni) => (
                        <UniversityCard key={uni.id} university={uni} onRemove={() => handleRemoveFavorite(uni.id)} />
                    ))
                ) : (
                    <p className="text-gray-500">{t("profile.noFavorites")}</p>
                )}
            </div>
        </div>
    );
}
