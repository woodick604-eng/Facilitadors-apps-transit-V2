import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: 'AIzaSyByZ75L4F1c9r_rL_C3k_vJpS7XpXpXpX0',
    authDomain: 'facilitadors-transit.firebaseapp.com',
    projectId: 'facilitadors-transit',
    storageBucket: 'facilitadors-transit.firebasestorage.app',
    messagingSenderId: '719513203160',
    appId: '1:719513203160:web:a68fc25fd89a8beaa882ad'
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const PROJECTS = [
  { id: 'facilitador', status: 'online', branch: 'main', lastCommit: 'Març 28 2026' },
  { id: 'dictat-atenea', status: 'online', branch: 'main', lastCommit: 'Març 27 2026' },
  { id: 'reanomenador', status: 'online', branch: 'main', lastCommit: 'Març 25 2026' },
  { id: 'informe-vector', status: 'online', branch: 'main', lastCommit: 'Març 28 2026' },
  { id: 'informe-atenea', status: 'online', branch: 'main', lastCommit: 'Març 26 2026' },
  { id: 'simptomatologia', status: 'online', branch: 'main', lastCommit: 'Març 24 2026' },
  { id: 'dictat-minutes', status: 'online', branch: 'main', lastCommit: 'Març 23 2026' }
];

async function seed() {
    console.log('Pujant dades a la web...');
    for (const p of PROJECTS) {
        await setDoc(doc(db, 'system_status', p.id), p);
    }
    console.log('Dades carregades correctament.');
    process.exit(0);
}

seed();
