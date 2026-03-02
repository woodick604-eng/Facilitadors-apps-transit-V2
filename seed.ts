import { initializeApp } from 'firebase/app';
import { getFirestore, collection, writeBatch, doc } from 'firebase/firestore';
import { FACILITADORS } from './src/users';

const firebaseConfig = {
    apiKey: "AIzaSyB4XD39Jh1FVcO_L20bgZYzhImVg9lkI1A",
    authDomain: "facilitadors-transit.firebaseapp.com",
    projectId: "facilitadors-transit",
    storageBucket: "facilitadors-transit.firebasestorage.app",
    messagingSenderId: "719513203160",
    appId: "1:719513203160:web:a68fc25fd89a8beaa882ad"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seed() {
    const batch = writeBatch(db);
    const usersRef = collection(db, 'users');

    FACILITADORS.forEach((user) => {
        const userDoc = doc(usersRef, user.tip);
        batch.set(userDoc, {
            tip: user.tip,
            name: user.name,
            pin: '5085',
            firstLogin: true
        });
    });

    // Add/Update Admin User (Keep 0852)
    const adminDoc = doc(usersRef, 'PG005085');
    batch.set(adminDoc, {
        tip: 'PG005085',
        name: 'ADMINISTRADOR',
        pin: '0852',
        firstLogin: false,
        isAdmin: true
    });

    await batch.commit();
    console.log('Successfully seeded users!');
    process.exit(0);
}

seed().catch(console.error);
