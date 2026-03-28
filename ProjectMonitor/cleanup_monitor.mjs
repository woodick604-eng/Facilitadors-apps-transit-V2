import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: 'AIzaSyByZ75L4F1c9r_rL_C3k_vJpS7XpXX0',
    authDomain: 'facilitadors-transit.firebaseapp.com',
    projectId: 'facilitadors-transit',
    storageBucket: 'facilitadors-transit.firebasestorage.app',
    messagingSenderId: '719513203160',
    appId: '1:719513203160:web:a68fc25fd89a8beaa882ad'
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const ALLOWED_PROJECTS = [
    'facilitador',
    'dictat-atenea',
    'reanomenador',
    'informe-atenea',
    'informe-vector',
    'simptomatologia',
    'dictat-minutes'
];

async function cleanup() {
    console.log('🚀 Iniciant neteja de Firestore (Monitor)...');

    // 1. Netejar system_status
    console.log('📂 Netejant system_status...');
    const statusSnap = await getDocs(collection(db, 'system_status'));
    for (const d of statusSnap.docs) {
        if (!ALLOWED_PROJECTS.includes(d.id)) {
            console.log(`   🗑️ Eliminant document obsolet: ${d.id}`);
            await deleteDoc(d.ref);
        }
    }

    // 2. Netejar recovery_points
    console.log('📦 Netejant recovery_points...');
    const recoverySnap = await getDocs(collection(db, 'recovery_points'));
    for (const d of recoverySnap.docs) {
        const data = d.data();
        if (!ALLOWED_PROJECTS.includes(data.projectName)) {
            console.log(`   🗑️ Eliminant punt de restauració obsolet: ${d.id} (${data.projectName})`);
            await deleteDoc(d.ref);
        }
    }

    console.log('✅ Neteja finalitzada.');
    process.exit(0);
}

cleanup().catch(err => {
    console.error('❌ Error durant la neteja:', err);
    process.exit(1);
});
