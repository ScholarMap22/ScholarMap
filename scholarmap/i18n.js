import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./src/locales/en.json";
import ru from "./src/locales/ru.json";
import kz from "./src/locales/kz.json";

i18n.use(initReactI18next).init({
    resources: { en: { translation: en }, ru: { translation: ru }, kz: { translation: kz } },
    lng: localStorage.getItem("language") || "ru",
    fallbackLng: "ru",
    interpolation: { escapeValue: false }
});

export default i18n;
