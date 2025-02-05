import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import SearchUniversities from "./pages/SearchUniversities";
import AddUniversity from "./pages/AddUniversity";

export default function App() 
{
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => 
    {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => 
        {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    if (loading) return <div className="text-center mt-10">Загрузка...</div>;

    return (
        <Router>
            <Routes>
                <Route path="/" element={<AuthPage />} />
                <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/" />} />
                <Route path="/search" element={<SearchUniversities />} />
                <Route path="/admin" element={user?.email === "mailybaevadilet@gmail.com" ? <AddUniversity /> : <Navigate to="/" />} />
            </Routes>
        </Router>
    );
}
