import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() 
{
    const { i18n } = useTranslation();

    const changeLanguage = (lng) => 
    {
        i18n.changeLanguage(lng);
        localStorage.setItem("language", lng);
    };

    return (
        <select value={i18n.language} onChange={(e) => changeLanguage(e.target.value)} className="border px-4 py-2 rounded">
            <option value="en">English</option>
            <option value="ru">Русский</option>
            <option value="kz">Қазақша</option>
        </select>
    );
}
