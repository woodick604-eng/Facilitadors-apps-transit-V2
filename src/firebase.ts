import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyB4XD39Jh1FVcO_L20bgZYzhImVg9lkI1A",
    authDomain: "facilitadors-transit.firebaseapp.com",
    projectId: "facilitadors-transit",
    storageBucket: "facilitadors-transit.firebasestorage.app",
    messagingSenderId: "719513203160",
    appId: "1:719513203160:web:a68fc25fd89a8beaa882ad"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Secondary app for Dictat Atenea access in Admin
const dictatConfig = {
    apiKey: "AIzaSyCReCN-ps4NwGuWycb6euaqpQqSjgMwoio",
    authDomain: "dictat-atenea-t06.firebaseapp.com",
    projectId: "dictat-atenea-t06",
    storageBucket: "dictat-atenea-t06.firebasestorage.app",
    messagingSenderId: "315810657079",
    appId: "1:315810657079:web:272e462e805009296da0b2"
};

const dictatAppInit = initializeApp(dictatConfig, 'dictat');
export const dictatDb = getFirestore(dictatAppInit);
