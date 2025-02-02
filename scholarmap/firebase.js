import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Инициализация Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBp1oaNO88_Oui_bLPzW-RaR7Inj05Ln5o",
    authDomain: "scholarmap-1dd3b.firebaseapp.com",
    projectId: "scholarmap-1dd3b",
    storageBucket: "scholarmap-1dd3b.firebasestorage.app",
    messagingSenderId: "777803804960",
    appId: "1:777803804960:web:45b821c9bfd7eb351c6745",
    measurementId: "G-5MGTD1F95K"
};


// Инициализация Firebase
const app = initializeApp(firebaseConfig);

// Инициализация Firestore
const db = getFirestore(app);

// Инициализация Storage
const storage = getStorage(app);

export { db, storage };
