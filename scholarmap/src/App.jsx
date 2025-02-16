import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import AdminPanel from "./pages/AdminPanel";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import UsagePolicy from "./pages/UsagePolicy";
import Header from "./components/Header";
import UniversityPage from "./pages/UniversityPage";
import "../i18n";

export default function App() 
{
    const [user, setUser] = useState(null);
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
    const [universities, setUniversities] = useState([]);
    const [search, setSearch] = useState("");
    
    const [favorites, setFavorites] = useState([]);

    const toggleFavorite = (university) => 
        {
            setFavorites((prevFavorites) => 
            {
                if (prevFavorites.some((fav) => fav.id === university.id)) 
                {
                    return prevFavorites.filter((fav) => fav.id !== university.id);
                } 
                else 
                {
                    return [...prevFavorites, university];
                }
            });
        };

    useEffect(() => 
    {
        const unsubscribe = auth.onAuthStateChanged(setUser);
        return () => unsubscribe();
    }, []);

    useEffect(() => 
    {
        document.documentElement.classList.remove("dark", "light");
        document.documentElement.classList.add(theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    useEffect(() => 
    {
        async function fetchUniversities() 
        {
            try 
            {
                const querySnapshot = await getDocs(collection(db, "universities"));
                const universityList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setUniversities(universityList);
            } 
            catch (error) 
            {
                console.error("Ошибка загрузки университетов:", error);
            }
        }

        fetchUniversities();
    }, []);

    return (
        <Router>
            <div>
                <Header user={user} theme={theme} setTheme={setTheme} />
                <Routes>
                    <Route path="/" element={<HomePage 
                                                universities={universities} 
                                                search={search} 
                                                setSearch={setSearch} 
                                                toggleFavorite={toggleFavorite} 
                                                favorites={favorites} 
                                             />} />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/admin" element={<AdminPanel />} />
                    <Route path="/policy" element={<UsagePolicy />} />
                    <Route path="/university/:id" element={<UniversityPage toggleFavorite={toggleFavorite} favorites={favorites} />} />

                    {/* Доступ только авторизованным пользователям */}
                    {user ? (
                        <>
                            <Route path="/settings" element={<SettingsPage theme={theme} setTheme={setTheme} />} />
                            <Route path="/profile" element={<ProfilePage user={user} />} />
                        </>
                    ) : (
                        <>
                            <Route path="/settings" element={<Navigate to="/auth" />} />
                            <Route path="/profile" element={<Navigate to="/auth" />} />
                        </>
                    )}

                    {/* Если путь не найден, редирект на главную */}
                    <Route path="*" element={<Navigate to="/" />} />
                    
                </Routes>
            </div>
        </Router>
    );
}
